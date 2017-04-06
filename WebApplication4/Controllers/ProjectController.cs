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
    [ActionName("ProcessChanges")]
    public bool ProcessChanges([FromBody] ChangeModel model)
    {
        return MSCG.processChanges(model);
    }

    [HttpPost]
    [ActionName("GetPassage")]
    public string GetPassage([FromBody] string title)
    {
        return SQLDatabase.getPassage(title);
    }
}