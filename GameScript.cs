// GameScript.cs
// Compile into a .NET WASM assembly named GameAssembly.dll and publish to root.
// Example methods: OnStart, OnUpdate. Use JS interop to call EngineAPI functions.

using System;
using System.Threading.Tasks;
using Microsoft.JSInterop;

public static class GameScript
{
    // Called once at startup
    [JSInvokable]
    public static Task OnStart()
    {
        // create a star via JS EngineAPI
        try {
            var e = (int)JSRuntime.Current.InvokeAsync<int>("EngineAPI.createEntity").Result;
            JSRuntime.Current.InvokeVoidAsync("EngineAPI.addTransform", e, 0, 0, 0);
            JSRuntime.Current.InvokeVoidAsync("EngineAPI.addStar", e, "G", 1.0, 1.0, 1.0, 0.95, 0.8);
        } catch {
            // fallback if JSRuntime not available
        }
        return Task.CompletedTask;
    }

    // Called every frame with dt (seconds)
    [JSInvokable]
    public static Task OnUpdate(double dt)
    {
        // simple camera bob
        try {
            var t = DateTime.UtcNow.Millisecond / 1000.0;
            JSRuntime.Current.InvokeVoidAsync("EngineAPI.setCamera", Math.Sin(t) * 10, 0, 200);
        } catch {}
        return Task.CompletedTask;
    }
}
