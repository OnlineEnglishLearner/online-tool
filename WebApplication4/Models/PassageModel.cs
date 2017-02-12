using System.Runtime.Serialization;

[DataContract]
public class PassageModel
{
    public PassageModel(string title, string content)
    {
        this.title = title;
        this.content = content;
    }

    [DataMember]
    public string title { get; set; }

    [DataMember]
    public string content { get; set; }
}