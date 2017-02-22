using System.Threading.Tasks;
using System.Web.Http;

public class ProjectController : ApiController
{
    [ActionName("AddPassage")]
    public int AddPassage([FromBody] PassageModel pmodel)
    {
        SQLDatabase.addPassage(pmodel.title, pmodel.content);
        return 0;
    }

/*    [HttpPost]
    [ActionName("GetPassage")]
    public string GetPassage([FromBody] string title)
    {
        return SQLDatabase.getPassage(title);
    }
*/
    [HttpPost]
    [ActionName("TriggerAPI")]
    public async Task<string> GetPassage([FromBody] string text)
    {
        return await SQLDatabase.tryMSCS(text);
    }
}