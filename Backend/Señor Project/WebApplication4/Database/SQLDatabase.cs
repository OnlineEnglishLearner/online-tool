using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;

public class SQLDatabase
{
    static string cname = "host=db4free.net; user=" + Credentials.DBUser + "; password=" + Credentials.DBPass + "; database=senorproject; Connection Timeout=30";
    static string query;
    static MySqlCommand cmd;

    static MySqlConnection connection = new MySqlConnection(cname);
    static string[] returnString;
    static string contentString;
    
    public static void addPassage(string title, string content)
    {
        try
        {
            if (connection.State == ConnectionState.Closed)
            {

                connection.Open();

                title = title.Replace("'", "\\'");
                content = content.Replace("'", "\\'");

                query = "INSERT INTO Passages (title, content) VALUES ('" + title + "', '" + content + "')";
                cmd = new MySqlCommand(query, connection);
                cmd.ExecuteNonQuery();
            }
        }
        catch (Exception e)
        {
            Debug.WriteLine("Error: {0}", e.ToString());
            returnString = null;
        }
        finally
        {
            if (connection != null)
                connection.Close();
        }
    }

    public static string getPassage(string title)
    {
        try
        {
            if (connection.State == ConnectionState.Closed)
            {

                connection.Open();

                int passageCount = 0;
                query = "SELECT COUNT(*) FROM Passages WHERE title = '" + title + "'";
                cmd = new MySqlCommand(query, connection);

                object result = cmd.ExecuteScalar();

                if (result != null)
                    passageCount = Convert.ToInt32(result);

                if (passageCount == 0)
                    contentString = "Title does not exit in the database";
                else
                {
                    query = "SELECT content FROM Passages WHERE title = '" + title + "'";
                    cmd = new MySqlCommand(query, connection);

                    MySqlDataReader dataReader = cmd.ExecuteReader();
                    dataReader.Read();

                    if (dataReader[0] != null)
                        contentString = "" + dataReader[0];

                    dataReader.Close();
                }
            }
        }
        catch (Exception e)
        {
            Debug.WriteLine("Error: {0}", e.ToString());
            returnString = null;
        }
        finally
        {
            if (connection != null)
                connection.Close();
        }

        return contentString;
    }
    
    public static async Task<ReturnModel> tryMSCS(string text)
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
            
            return MSCG.Handle(text, daughter);
        }
    }
}