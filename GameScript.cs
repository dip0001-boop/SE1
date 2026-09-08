// GameScript.cs - sample C# script for GameAssembly
using System.Threading.Tasks;
using Microsoft.JSInterop;

public static class GameScript
{
    [JSInvokable]
    public static Task OnStart()
    {
        // create a star and a planet via JS EngineAPI
        try {
            var e = JSRuntime.Current.InvokeAsync<int>("EngineAPI.createEntity").Result;
            JSRuntime.Current.InvokeVoidAsync("EngineAPI.addTransform", e, 0, 0, 0);
            JSRuntime.Current.InvokeVoidAsync("EngineAPI.addStar", e, "G", 1.0, 2.0, 1.0, 0.95, 0.8);
        } catch {
            // ignore if JSRuntime not available in this environment
        }
        return Task.CompletedTask;
    }

    [JSInvokable]
    public static Task OnUpdate(double dt)
    {
        // simple camera bob
        try {
            var t = (System.DateTime.UtcNow.Millisecond % 1000) / 1000.0;
            JSRuntime.Current.InvokeVoidAsync("EngineAPI.setCamera", System.Math.Sin(t) * 10, 0, 200);
        } catch {}
        return Task.CompletedTask;
    }
}
