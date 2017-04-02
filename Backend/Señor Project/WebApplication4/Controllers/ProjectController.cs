using System.Threading.Tasks;
using System.Web.Http;

public class ProjectController : ApiController
{
    [HttpPost]
    [ActionName("Suggestions")]
    public async Task<ReturnModel> GetSuggestions([FromBody] string text)
    {
        return await MSCG.MSCSSuggestions(text);
    }

    [HttpPost]
    [ActionName("NoSuggestions")]
    public ReturnModel GetNoSuggestions([FromBody] string text)
    {
        return MSCG.MSCSNoSuggestions(text);
    }

    [HttpPost]
    [ActionName("AddPassage")]
    public bool AddPassage([FromBody] PassageModel model)
    {
        return SQLDatabase.addPassage(model.Title, model.Content);
    }

}