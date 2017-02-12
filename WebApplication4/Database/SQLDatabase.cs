using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Diagnostics;

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

    public static string[] getNames()
    {
        try {
            if (connection.State == ConnectionState.Closed) {

                connection.Open();
                
                int nameCount = 0;
                query = "SELECT COUNT(Name) FROM Users";
                cmd = new MySqlCommand(query, connection);

                object result = cmd.ExecuteScalar();

                if (result != null)
                    nameCount = Convert.ToInt32(result);
                
                returnString = new string[nameCount];

                query = "SELECT Name FROM Users ORDER BY Name ASC";
                cmd = new MySqlCommand(query, connection);

                MySqlDataReader dataReader = cmd.ExecuteReader();

                int index = 0;

                while (dataReader.Read())
                    returnString[index++] = "" + dataReader[0];
                
                dataReader.Close();
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

        return returnString;
    }
}