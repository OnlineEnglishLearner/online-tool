using System.Threading.Tasks;
using System.Web.Http;

public class ProjectController : ApiController
{
    [HttpPost]
    [ActionName("Suggestions")]
    public async Task<ReturnModel> GetSuggestions([FromBody] string text)
    {
        return await SQLDatabase.tryMSCS(text);
    }

    [HttpPost]
    [ActionName("AddPassage")]
    public bool AddPassage([FromBody] PassageModel model)
    {
        return SQLDatabase.addPassage(model.Title, model.Content);
    }

}