using System.Web.Http;

public class ProjectController : ApiController
{
    [ActionName("Testing")]
    public string[] Testing([FromBody] string input)
    {
        return SQLDatabase.getNames();
    }

    [ActionName("AddPassage")]
    public void AddPassage([FromBody] PassageModel pmodel)
    {
        SQLDatabase.addPassage(pmodel.title, pmodel.content);
    }

    [HttpPost]
    [ActionName("GetPassage")]
    public string GetPassage([FromBody] string title)
    {
        return SQLDatabase.getPassage(title);
    }
}