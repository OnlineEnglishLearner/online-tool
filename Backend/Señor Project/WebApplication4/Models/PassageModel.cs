using System.Runtime.Serialization;

[DataContract]
public class PassageModel
{
    public PassageModel(string title, string content)
    {
        this.Title = title;
        this.Content = content;
    }

    [DataMember]
    public string Title { get; set; }

    [DataMember]
    public string Content { get; set; }
}