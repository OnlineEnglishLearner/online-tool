using System.Web.Http;

public class ProjectController : ApiController
{
    [HttpPost]
    [ActionName("Testing")]
    public string[] Testing([FromBody] string input)
    {
        return SQLDatabase.getNames();
    }
}