using UnityEngine;
using System;
using System.Runtime.InteropServices;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace VelvetVendetta.Gameplay
{
    // No Xbox service dependency. Both input backends feed the same gameplay controls.
    public static class PlayerInput
    {
        public static bool UsingGamepad { get; private set; }
        public static Vector2 Move { get; private set; }
        public static Vector2 Look { get; private set; }
        public static bool Confirm { get; private set; }
        public static bool Back { get; private set; }
        public static bool Pause { get; private set; }
        public static bool Journal { get; private set; }
        public static bool Sprint { get; private set; }
        public static int Navigate { get; private set; }
        private static bool navigationHeld;
        private static Vector3 lastMouse;
        private static ushort lastButtons;

        public static void Read()
        {
            Move = Vector2.zero;
            Look = Vector2.zero;
            Confirm = Back = Pause = Journal = Sprint = false;
            Navigate = 0;
            float navigation = 0;
#if ENABLE_INPUT_SYSTEM
            Keyboard keyboard = Keyboard.current;
            if (keyboard != null)
            {
                Move = new Vector2(
                    (keyboard.dKey.isPressed || keyboard.rightArrowKey.isPressed ? 1 : 0)
                        - (keyboard.aKey.isPressed || keyboard.leftArrowKey.isPressed ? 1 : 0),
                    (keyboard.wKey.isPressed || keyboard.upArrowKey.isPressed ? 1 : 0)
                        - (keyboard.sKey.isPressed || keyboard.downArrowKey.isPressed ? 1 : 0));
                Confirm = keyboard.eKey.wasPressedThisFrame || keyboard.enterKey.wasPressedThisFrame;
                Back = keyboard.escapeKey.wasPressedThisFrame;
                Pause = Back;
                Journal = keyboard.jKey.wasPressedThisFrame || keyboard.tabKey.wasPressedThisFrame;
                Sprint = keyboard.leftShiftKey.isPressed || keyboard.rightShiftKey.isPressed;
                navigation = Move.y;
                if (Move.sqrMagnitude > .01f || Confirm || Back || Journal) UsingGamepad = false;
            }
            Mouse mouse = Mouse.current;
            if (mouse != null && mouse.rightButton.isPressed)
            {
                Look = mouse.delta.ReadValue() * .06f;
                UsingGamepad = false;
            }
            Gamepad pad = Gamepad.current;
            if (pad != null)
            {
                Vector2 stick = DeadZone(pad.leftStick.ReadValue());
                Vector2 right = DeadZone(pad.rightStick.ReadValue());
                Vector2 dpad = pad.dpad.ReadValue();
                bool action = pad.buttonSouth.wasPressedThisFrame || pad.buttonEast.wasPressedThisFrame
                    || pad.startButton.wasPressedThisFrame || pad.selectButton.wasPressedThisFrame;
                if (stick.sqrMagnitude > 0 || right.sqrMagnitude > 0 || dpad.sqrMagnitude > 0 || action)
                    UsingGamepad = true;
                if (UsingGamepad)
                {
                    Move = stick.sqrMagnitude > 0 ? stick : dpad;
                    Look = right;
                    navigation = Mathf.Abs(dpad.y) > .5f ? dpad.y : stick.y;
                }
                Confirm |= pad.buttonSouth.wasPressedThisFrame;
                Back |= pad.buttonEast.wasPressedThisFrame;
                Pause |= pad.startButton.wasPressedThisFrame;
                Journal |= pad.selectButton.wasPressedThisFrame || pad.buttonNorth.wasPressedThisFrame;
                Sprint |= pad.leftStickButton.isPressed || pad.rightShoulder.isPressed;
            }
#else
            Move = new Vector2((Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow) ? 1 : 0)
                - (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow) ? 1 : 0),
                (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow) ? 1 : 0)
                - (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow) ? 1 : 0));
            NativePad pad = ReadWindowsPad();
            Vector2 stick = DeadZone(new Vector2(pad.leftX / 32767f, pad.leftY / 32767f));
            Vector2 right = DeadZone(new Vector2(pad.rightX / 32767f, pad.rightY / 32767f));
            Vector2 dpad = new Vector2((Held(pad, 8) ? 1 : 0) - (Held(pad, 4) ? 1 : 0),
                (Held(pad, 1) ? 1 : 0) - (Held(pad, 2) ? 1 : 0));
            bool padConfirm = Pressed(pad, 0x1000) || Input.GetKeyDown(KeyCode.JoystickButton0);
            bool padBack = Pressed(pad, 0x2000) || Input.GetKeyDown(KeyCode.JoystickButton1);
            if (stick.sqrMagnitude > 0 || right.sqrMagnitude > 0 || dpad.sqrMagnitude > .1f
                || padConfirm || padBack || Input.GetKeyDown(KeyCode.JoystickButton7)) UsingGamepad = true;
            if (Move.sqrMagnitude > 0 || Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.S)
                || Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.E) || Input.GetKey(KeyCode.Return)
                || Input.GetKey(KeyCode.Escape)) UsingGamepad = false;
            if (UsingGamepad) Move = stick.sqrMagnitude > 0 ? stick : dpad;
            Vector3 mouseDelta = Input.mousePosition - lastMouse;
            lastMouse = Input.mousePosition;
            Look = UsingGamepad ? right : (Input.GetMouseButton(1)
                ? new Vector2(mouseDelta.x, mouseDelta.y) * .06f : Vector2.zero);
            Confirm = Input.GetKeyDown(KeyCode.E) || Input.GetKeyDown(KeyCode.Return) || padConfirm;
            Back = Input.GetKeyDown(KeyCode.Escape) || padBack;
            Pause = Input.GetKeyDown(KeyCode.Escape) || Pressed(pad, 0x10) || Input.GetKeyDown(KeyCode.JoystickButton7);
            Journal = Input.GetKeyDown(KeyCode.J) || Input.GetKeyDown(KeyCode.Tab)
                || Pressed(pad, 0x20) || Pressed(pad, 0x8000)
                || Input.GetKeyDown(KeyCode.JoystickButton6) || Input.GetKeyDown(KeyCode.JoystickButton3);
            Sprint = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.JoystickButton8)
                || Input.GetKey(KeyCode.JoystickButton5) || Held(pad, 0x40) || Held(pad, 0x200);
            navigation = Move.y;
            lastButtons = pad.buttons;
#endif
            Move = Vector2.ClampMagnitude(Move, 1);
            if (Mathf.Abs(navigation) < .35f) navigationHeld = false;
            else if (!navigationHeld)
            {
                Navigate = navigation > 0 ? -1 : 1;
                navigationHeld = true;
            }
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        private static void Reset()
        {
            UsingGamepad = false;
            navigationHeld = false;
            lastButtons = 0;
            lastMouse = Vector3.zero;
        }

        // XInput ships with Windows; this fallback avoids changing InputManager assets.
        // Unity Input System, when active, handles all platforms including future console builds.
        [StructLayout(LayoutKind.Sequential)]
        private struct NativePad
        {
            public ushort buttons;
            public byte leftTrigger, rightTrigger;
            public short leftX, leftY, rightX, rightY;
        }
        [StructLayout(LayoutKind.Sequential)]
        private struct NativeState { public uint packet; public NativePad gamepad; }
#if UNITY_STANDALONE_WIN || UNITY_EDITOR_WIN
        [DllImport("xinput1_4.dll", CallingConvention = CallingConvention.StdCall)]
        private static extern uint XInputGetState(uint userIndex, out NativeState state);
#endif
        private static NativePad ReadWindowsPad()
        {
#if UNITY_STANDALONE_WIN || UNITY_EDITOR_WIN
            try
            {
                for (uint index = 0; index < 4; index++)
                {
                    NativeState state;
                    if (XInputGetState(index, out state) == 0) return state.gamepad;
                }
            }
            catch (DllNotFoundException) { }
            catch (EntryPointNotFoundException) { }
#endif
            return default(NativePad);
        }
        private static bool Held(NativePad pad, ushort button) { return (pad.buttons & button) != 0; }
        private static bool Pressed(NativePad pad, ushort button)
        { return Held(pad, button) && (lastButtons & button) == 0; }

        private static Vector2 DeadZone(Vector2 value)
        {
            const float deadZone = .22f;
            float magnitude = value.magnitude;
            return magnitude <= deadZone ? Vector2.zero
                : value.normalized * Mathf.Clamp01((magnitude - deadZone) / (1 - deadZone));
        }
    }
}
