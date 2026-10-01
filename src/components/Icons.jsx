// Ícones de linha usados no lugar de emojis em todo o app.
// Todos herdam a cor do elemento pai via currentColor.

function base(props) {
  return {
    width: props.size || 18,
    height: props.size || 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
}

export function IconHospital(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 21 V9 L12 3 L20 9 V21 Z" />
      <path d="M9 21 V14 H15 V21" />
    </svg>
  )
}

export function IconClipboard(props) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 2 H15 V6 H9 Z" />
      <path d="M8 11 H16 M8 15 H13" />
    </svg>
  )
}

export function IconCalendar(props) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10 H20 M8 3 V7 M16 3 V7" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 V12 L15 15" />
    </svg>
  )
}

export function IconBolt(props) {
  return (
    <svg {...base(props)}>
      <path d="M13 2 L4 14 H11 L10 22 L20 9 H13 Z" />
    </svg>
  )
}

export function IconMapPin(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 21 C8 17 5 13.5 5 9.5 A7 7 0 0 1 19 9.5 C19 13.5 16 17 12 21 Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  )
}

export function IconPhone(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 3 H9 L11 8 L8.5 9.5 A11 11 0 0 0 14.5 15.5 L16 13 L21 15 V18 A3 3 0 0 1 18 21 C10 21 3 14 3 6 A3 3 0 0 1 6 3 Z" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base(props)}>
      <path d="M5 12 L10 17 L19 7" />
    </svg>
  )
}

export function IconArrowRight(props) {
  return (
    <svg {...base(props)}>
      <path d="M5 12 H19 M13 6 L19 12 L13 18" />
    </svg>
  )
}

export function IconSettings(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.35a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.65 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.65a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.35 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.04Z" />
    </svg>
  )
}

export function IconStethoscope(props) {
  return (
    <svg {...base(props)}>
      <path d="M5 3 V10 A5 5 0 0 0 15 10 V3" />
      <path d="M5 3 H7 M13 3 H15" />
      <path d="M15 10 V13 A6 6 0 0 0 21 19 A2.5 2.5 0 1 0 19 15" />
      <circle cx="20.5" cy="19.5" r="1.5" />
    </svg>
  )
}

export function IconCompass(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9 L13 13 L9 15 L11 11 Z" />
    </svg>
  )
}

export function IconUser(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 A8 8 0 0 1 20 21" />
    </svg>
  )
}

export function IconLogout(props) {
  return (
    <svg {...base(props)}>
      <path d="M9 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 H9" />
      <path d="M16 17 L21 12 L16 7 M21 12 H9" />
    </svg>
  )
}

export function IconPlus(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 5 V19 M5 12 H19" />
    </svg>
  )
}

export function IconX(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 6 L18 18 M18 6 L6 18" />
    </svg>
  )
}