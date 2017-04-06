public class Cache
{
    public Cache()
    {
        CurrentIndex = 0;
        Size = 0;
        Capacity = 5;
        Keys = new string[Capacity];
        Values = new string[Capacity];
    }

    int CurrentIndex { get; set; }
    int Size { get; set; }
    int Capacity { get; set; }
    string[] Keys { get; set; }
    string[] Values { get; set; }

    public bool ContainsKey(string key)
    {
        for(int i = 0; i < Size; ++i)
            if(Keys[i].Equals(key))
                return true;

        return false;
    }

    public bool Add(string key, string value)
    {
        if (ContainsKey(key))
            return false;

        Keys[CurrentIndex] = key;
        Values[CurrentIndex] = value;

        CurrentIndex = (CurrentIndex + 1) % Capacity;
        Size += Size >= Capacity ? 0 : 1;

        return true;
    }

    public string Get(string key)
    {
        for (int i = 0; i < Size; ++i)
            if (Keys[i].Equals(key))
                return Values[i];

        return null;
    }
}