using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;

public class SQLDatabase
{
    static string cname = "host=db4free.net; user=" + Credentials.DBUser + "; password=" + Credentials.DBPass + "; database=senorproject; Connection Timeout=60";
    static string query;
    static MySqlCommand cmd;

    static MySqlConnection connection = new MySqlConnection(cname);
    static string[] returnString;
    static string contentString;

    static Cache cache = new Cache();
    
    public static bool addPassage(string title, string content)
    {
        if (cache.ContainsKey(title))
            return false;

        cache.Add(title, content);

        return true;
        /*
        try
        {
            if (connection.State == ConnectionState.Closed)
            {

                connection.Open();

                title = title.Replace("'", "\\'");


                int passageCount = 0;
                query = "SELECT COUNT(*) FROM Passages WHERE title = '" + title + "'";
                cmd = new MySqlCommand(query, connection);

                object result = cmd.ExecuteScalar();

                if (result != null)
                    passageCount = Convert.ToInt32(result);
                else
                    return false;

                // title already taken
                if (passageCount > 0)
                    return false;

                content = content.Replace("'", "\\'");

                query = "INSERT INTO Passages (title, content) VALUES ('" + title + "', '" + content + "')";
                cmd = new MySqlCommand(query, connection);
                cmd.ExecuteNonQuery();

                return true;
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

        return false;*/
    }

    public static bool titleExists(string title)
    {
        try
        {
            if (connection.State == ConnectionState.Closed)
            {

                connection.Open();

                title = title.Replace("'", "\\'");


                int passageCount = 0;
                query = "SELECT COUNT(*) FROM Passages WHERE title = '" + title + "'";
                cmd = new MySqlCommand(query, connection);

                object result = cmd.ExecuteScalar();

                if (result != null)
                    passageCount = Convert.ToInt32(result);
                else
                    return false;

                // title already taken
                return passageCount == 0;
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

        return false;
    }

    public static string getPassage(string title)
    {
        string res;

        if (cache.ContainsKey(title))
            res = cache.Get(title);
        else
            res = "Title does not exist";

        return res;
        /*
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
    */
    }
}