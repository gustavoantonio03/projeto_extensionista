/**
 * @siglo/ui — Design tokens "Serene Clinical Humanism" + "Acolher"
 * Fontes:
 * - Serene: stitch_app_oncologia_pedi_trica/serene_clinical_humanism/DESIGN.md
 * - Acolher: docs/08-ux/design-system-acolher.md (Portal Paciente/Cuidador pediátrico e adulto)
 */

export const colors = {
  surface: "#faf9f7",
  surfaceDim: "#dadad8",
  surfaceBright: "#faf9f7",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f4f3f1",
  surfaceContainer: "#efeeec",
  surfaceContainerHigh: "#e9e8e6",
  surfaceContainerHighest: "#e3e2e0",
  onSurface: "#1a1c1b",
  onSurfaceVariant: "#404849",
  inverseSurface: "#2f3130",
  inverseOnSurface: "#f1f1ef",
  outline: "#70797a",
  outlineVariant: "#bfc8c9",
  surfaceTint: "#30666c",

  primary: "#00363b",
  onPrimary: "#ffffff",
  primaryContainer: "#134e54",
  onPrimaryContainer: "#89bec5",
  inversePrimary: "#9ad0d6",
  primaryFixed: "#b6ecf3",
  primaryFixedDim: "#9ad0d6",
  onPrimaryFixed: "#001f23",
  onPrimaryFixedVariant: "#134e54",

  secondary: "#5a5d71",
  onSecondary: "#ffffff",
  secondaryContainer: "#dcdef5",
  onSecondaryContainer: "#5e6275",
  secondaryFixed: "#dfe1f8",
  secondaryFixedDim: "#c3c5dc",
  onSecondaryFixed: "#171b2b",
  onSecondaryFixedVariant: "#434658",

  tertiary: "#00382d",
  onTertiary: "#ffffff",
  tertiaryContainer: "#005142",
  onTertiaryContainer: "#7bc3af",
  tertiaryFixed: "#a8f1db",
  tertiaryFixedDim: "#8cd4c0",
  onTertiaryFixed: "#002019",
  onTertiaryFixedVariant: "#005142",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  background: "#faf9f7",
  onBackground: "#1a1c1b",
  surfaceVariant: "#e3e2e0",

  /** Acentos funcionais do DESIGN.md */
  alertCoral: "#c85a32",
  alertAmber: "#b87428",
  neutralDark: "#1a2426",
  borderOrganic: "#e4e0d8",
  divider: "#f0eee9",
  secondarySupportBg: "#eeebe5",
  chipRestingBg: "#f0eee9",
  chipRestingText: "#454b4d",
  chipSelectedBg: "#e6eff0",
  chipSelectedText: "#134e54",
  chipSelectedBorder: "#94bdc1",
  inputBorder: "#dcd7cd",
} as const;

export const typography = {
  fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  displayLg: { fontSize: "36px", fontWeight: 700, lineHeight: "44px" },
  displayLgMobile: { fontSize: "28px", fontWeight: 700, lineHeight: "36px" },
  headlineLg: { fontSize: "24px", fontWeight: 600, lineHeight: "32px" },
  headlineMd: { fontSize: "20px", fontWeight: 600, lineHeight: "28px" },
  headlineSm: { fontSize: "18px", fontWeight: 600, lineHeight: "24px" },
  bodyLg: { fontSize: "17px", fontWeight: 400, lineHeight: "26px" },
  bodyMd: { fontSize: "15px", fontWeight: 400, lineHeight: "22px" },
  bodySm: { fontSize: "13px", fontWeight: 400, lineHeight: "18px" },
  labelLg: { fontSize: "15px", fontWeight: 600, lineHeight: "20px" },
  labelMd: { fontSize: "13px", fontWeight: 500, lineHeight: "18px" },
  labelSm: { fontSize: "11px", fontWeight: 600, lineHeight: "16px" },
} as const;

export const spacing = {
  touchMin: "48px",
  touchExpanded: "56px",
  insetXs: "4px",
  insetSm: "8px",
  insetMd: "16px",
  insetLg: "24px",
  insetXl: "32px",
  stackSm: "8px",
  stackMd: "16px",
  stackLg: "24px",
  gutterMobile: "16px",
  gutterTablet: "24px",
  marginScreen: "20px",
} as const;

export const radius = {
  sm: "0.25rem",
  default: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  card: "1.75rem", // 28px — cantos arredondados de cards Acolher
  full: "9999px",
} as const;

/** Sombras com tint petroleum — nunca cinza/preto puro (DESIGN.md §Elevation). */
export const shadows = {
  level1: "0 2px 12px -2px rgba(19, 78, 84, 0.05)",
  level2: "0 8px 24px -4px rgba(19, 78, 84, 0.10)",
  level3: "0 16px 40px -8px rgba(26, 36, 38, 0.16)",
  borderLevel1: "1px solid rgba(228, 224, 216, 0.7)",
  // Sombras com tint ameixa para design system Acolher
  soft: "0 4px 20px -4px rgba(110, 63, 140, 0.08)",
  lift: "0 10px 30px -6px rgba(110, 63, 140, 0.14)",
  modal: "0 20px 48px -10px rgba(31, 35, 64, 0.22)",
} as const;

/** Regras de acessibilidade/movimento do design system. */
export const a11y = {
  minBaseFontSizePx: 15,
  minTouchTargetPx: 48,
  primaryTouchTargetPx: 56,
  wcagTarget: "2.1 AA",
} as const;

/**
 * Paleta do Design System "Acolher"
 * Desenvolvido para Portal Paciente/Cuidador (público infantil + adulto).
 * Contraste verificado para WCAG 2.1 AA.
 */
export const acolherColors = {
  canvas: "#FFF8F0",
  cream: "#FAEBD6",
  cardBg: "#FFFFFF",

  peach100: "#FDE6CF",
  peach200: "#F9C98F",
  peach300: "#F6AE5C",

  plum50: "#F6F0FA",
  plum100: "#EDE3F5",
  plum600: "#6E3F8C", // Ação primária (7.6:1 em branco)
  plum700: "#5A3175", // Hover / Press
  plum800: "#45245B",

  lavender100: "#EDE6F6",
  lavender300: "#B79AD6",

  orange400: "#F08A5D",
  orange700: "#B04A26",

  ink: "#1F2340", // Texto principal
  inkMuted: "#5B5F7A", // Texto secundário
  line: "#F1E4D6", // Divisores e bordas suaves

  success: "#2E7D5B",
  successBg: "#E5F4EC",

  warning: "#9A5B0F",
  warningBg: "#FFF1DA",

  danger: "#C0392B",
  dangerBg: "#FDECEA",

  clinical: "#134E54",
  clinicalBg: "#E6EFF0",
} as const;

export const acolherTypography = {
  fontSans: "'Nunito', system-ui, -apple-system, sans-serif",
  fontDisplay: "'Fraunces', serif",
} as const;

export type ColorToken = keyof typeof colors;
export type AcolherColorToken = keyof typeof acolherColors;

export const sigloTheme = {
  colors,
  acolherColors,
  typography,
  acolherTypography,
  spacing,
  radius,
  shadows,
  a11y,
} as const;

export default sigloTheme;
