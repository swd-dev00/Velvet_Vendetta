using UnityEngine;

namespace VelvetVendetta.Core
{
    public sealed class GameBootstrap : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Boot()
        {
            if (GameObject.Find("VelvetVendetta") != null)
                return;

            GameObject root = new GameObject("VelvetVendetta");
            DontDestroyOnLoad(root);
            root.AddComponent<GameBootstrap>();
        }

        private void Awake()
        {
            Debug.Log("[Velvet Vendetta] Game bootstrap online.");
        }
    }
}
