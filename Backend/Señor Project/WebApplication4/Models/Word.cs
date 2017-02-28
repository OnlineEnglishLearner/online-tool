using System.Runtime.Serialization;

[DataContract]
public class Word
{
    public Word(string value, string pos, int[] syllableIndices, string syllabifiedVersion)
    {
        Value = value;
        POS = pos;
        SyllableIndices = syllableIndices;
        SyllabifiedVersion = syllabifiedVersion;
    }

    [DataMember]
    public string Value { get; set; }

    [DataMember]
    public string POS { get; set; }

    [DataMember]
    public string SyllabifiedVersion { get; set; }

    [DataMember]
    public int[] SyllableIndices { get; set; }
}