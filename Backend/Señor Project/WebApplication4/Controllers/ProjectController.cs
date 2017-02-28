using System.Threading.Tasks;
using System.Web.Http;

public class ProjectController : ApiController
{
    [HttpPost]
    [ActionName("TriggerAPI")]
    public async Task<Word[][]> GetPassage([FromBody] string text)
    {
        return await SQLDatabase.tryMSCS(text);
    }
}