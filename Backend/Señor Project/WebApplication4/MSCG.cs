using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

public class MSCG
{
    // reference: https://www.microsoft.com/cognitive-services/en-us/linguistic-analysis-api/documentation/POS-tagging
    private static string[] wildTags = { "$", "``", "\"", "(", ")", ",", "--", ".", ":" };

    public static async Task<ReturnModel> MSCSSuggestions(string text)
    {
        var client = new HttpClient();

        // Request headers
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", Credentials.SubscriptionKey);
        var uri = "https://westus.api.cognitive.microsoft.com/linguistics/v1.0/analyze";

        // Request body
        string analyzeText = text;
        byte[] byteData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(MSCG.GenerateRequest(analyzeText))); // "{ \"language\" : \"en\", \"analyzerIds\" : [\"4fa79af1-f22c-408d-98bb-b7d7aeef7f04\"], \"text\" : \"" + analyzeText + "\"}");

        using (var content = new ByteArrayContent(byteData))
        {
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var response = await client.PostAsync(uri, content);
            var contents = await response.Content.ReadAsStringAsync();

            MSCGJson[] son = JsonConvert.DeserializeObject<MSCGJson[]>(contents);
            MSCGJson daughter = son[0];

            return Handle(text, daughter);
        }
    }

    public static ReturnModel MSCSNoSuggestions(string text)
    {
        string[] originalWords = text.Split(' ');
        int wordIndex = 0;

        Word[][] words = new Word[1][];
        words[0] = new Word[originalWords.Length];

        for(int i = 0; i < originalWords.Length; ++i)
            words[0][i] = new Word(originalWords[i], null, -1, null, wordIndex++);

        return new ReturnModel(words, GenerateHTML(words, false));
    }

    public static ReturnModel Handle(string text, MSCGJson son)
    {
        string[][] sentences = son.result;

        string[] originalSentences = text.Split(' ');
        int originIndex = 0;
        int wordIndex = 0;

        Word[][] postags = new Word[sentences.Length][];
        List<Word> list;

        for (int i = 0; i < sentences.Length; ++i)
        {
            list = new List<Word>();

            foreach (string j in sentences[i])
                if (!isMSCGSymbol(j))
                    list.Add(new Word(originalSentences[originIndex], POSType(j), syllableIndices(originalSentences[originIndex]), Syllable.Syllabify(originalSentences[originIndex++]), wordIndex++));
             

            postags[i] = list.ToArray();
        }

        return new ReturnModel(postags, GenerateHTML(postags, true));
    }

    public static bool processChanges(ChangeModel model)
    {
        foreach(TeacherChange change in model.Changes) {
            int id = int.Parse(change.id);

            int sentence = 0;
            int helper = id;

            while (helper > model.RModel.Content[sentence].Length-1)
                helper -= model.RModel.Content[sentence++].Length;

            if (change.action.Equals("add"))
                model.RModel.Content[sentence][helper].POS = POSType(change.pos);
            else
                model.RModel.Content[sentence][helper].POS = POSType("Unknown");
        }

        return SQLDatabase.addPassage(model.Title, GenerateHTML(model.RModel.Content, true));
    }

    private static int syllableIndices(string text)
    {
        int mask = 0;
        text = Syllable.Syllabify(text);

        int i = text.IndexOf('∙');

        while(i != -1)
        {
            mask |= (1 << (i));
            i = text.IndexOf('∙', i + 1);
        }

        return mask;
    }

    private static bool isMSCGSymbol(string candidate)
    {
        foreach (string tag in wildTags)
            if (tag.Equals(candidate))
                return true;

        return false;
    }

    private enum PartOfSpeech
    {
        Noun, Adjective, Verb, Unknown
    }

    private static string POSType(string candidate)
    {
        // Things like proper nouns are 'NNP' & past tense verbs are 'VBD' 
        candidate = candidate.ToUpper().Substring(0, 2);

        PartOfSpeech pos;
        
        switch (candidate)
        {
            case "NO":
            case "NN": pos = PartOfSpeech.Noun; break;

            case "VE":
            case "VB": pos = PartOfSpeech.Verb; break;

            case "AD":
            case "JJ": pos = PartOfSpeech.Adjective; break;

            default: pos = PartOfSpeech.Unknown; break;
        }

        return "" + pos;
    }

    public static string GenerateHTML(Word[][] text, bool suggestions)
    {
        StringBuilder html = new StringBuilder();
       
        foreach(Word[] sentence in text)
            foreach(Word word in sentence)
                if(suggestions)
                    html.Append("<span id=\"" + word.Index + "\" class=\"word " + word.POS.ToLower() + "\">" + word.Value + "</span> ");
                else
                    html.Append("<span id=\"" + word.Index + "\" class=\"word\">" + word.Value + "</span> ");

        return html.ToString();
    }

    public static MSCGJsonRequest GenerateRequest(string text)
    {
        MSCGJsonRequest json = new MSCGJsonRequest();

        json.language = "en";
        json.analyzerIds = new string[] {"4fa79af1-f22c-408d-98bb-b7d7aeef7f04"};
        json.text = text;

        return json;
    }
}