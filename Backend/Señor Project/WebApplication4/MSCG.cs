using System.Collections.Generic;
using System.Text;
using System.Web;

public class MSCG
{
    // reference: https://www.microsoft.com/cognitive-services/en-us/linguistic-analysis-api/documentation/POS-tagging
    private static string[] wildTags = { "$", "``", "\"", "(", ")", ",", "--", ".", ":" };
    
    public static ReturnModel Handle(string text, MSCGJson son)
    {
        string[][] sentences = son.result;

        string[] originalSentences = text.Split(' ');
        int originIndex = 0;

        Word[][] postags = new Word[sentences.Length][];
        List<Word> list;

        for (int i = 0; i < sentences.Length; ++i)
        {
            list = new List<Word>();

            foreach (string j in sentences[i])
            {
                if (!isMSCGSymbol(j))
                {
                    list.Add(new Word(originalSentences[originIndex], POSType(j), syllableIndices(originalSentences[originIndex]), Syllable.Syllabify(originalSentences[originIndex++])));
                }
            }

            postags[i] = list.ToArray();
        }

        return new ReturnModel(postags, GenerateHTML(postags));
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
        candidate = candidate.Substring(0, 2);

        PartOfSpeech pos;
        
        switch (candidate)
        {
            case "NN": pos = PartOfSpeech.Noun; break;

            case "VB": pos = PartOfSpeech.Verb; break;

            case "JJ": pos = PartOfSpeech.Adjective; break;

            default: pos = PartOfSpeech.Unknown; break;
        }

        return "" + pos;
    }

    public static string GenerateHTML(Word[][] text)
    {
        StringBuilder html = new StringBuilder();
        html.Append("<p>");

        foreach(Word[] sentence in text)
            foreach(Word word in sentence)
            {
                html.Append("<span class=\"" + word.POS + "\">" + word.Value + "</span>&nbsp");
            }

        html.Append("</p>");
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