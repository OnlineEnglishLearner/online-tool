using System.Runtime.Serialization;

[DataContract]
public class MSCGJson
{
    [DataMember]
    public string analyzerId { get; set; }

    [DataMember]
    public string[][] result { get; set; }
}