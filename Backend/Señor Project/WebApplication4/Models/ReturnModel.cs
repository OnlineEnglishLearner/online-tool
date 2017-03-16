using System.Runtime.Serialization;

[DataContract]
public class ReturnModel
{
    public ReturnModel(Word[][] content, string html)
    {
        this.Content = content;
        this.HTML = html;
    }

    [DataMember]
    public Word[][] Content { get; set; }

    [DataMember]
    public string HTML { get; set; }
}