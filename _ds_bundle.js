/* @ds-bundle: {"format":3,"namespace":"DarkSideOfTheRainbowDesignSystem_939f41","components":[{"name":"IssueTab","sourcePath":"components/actions/IssueTab.jsx"},{"name":"NavButton","sourcePath":"components/actions/NavButton.jsx"},{"name":"NavSquare","sourcePath":"components/actions/NavButton.jsx"},{"name":"Pill","sourcePath":"components/actions/Pill.jsx"},{"name":"Tag","sourcePath":"components/actions/Pill.jsx"},{"name":"ShareButton","sourcePath":"components/actions/ShareButton.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"ActionBar","sourcePath":"components/feed/ActionBar.jsx"},{"name":"Avatar","sourcePath":"components/feed/Avatar.jsx"},{"name":"NavDots","sourcePath":"components/feed/NavDots.jsx"},{"name":"StatBlock","sourcePath":"components/feed/StatBlock.jsx"},{"name":"PhoneFrame","sourcePath":"components/surfaces/PhoneFrame.jsx"},{"name":"PosterCard","sourcePath":"components/surfaces/PosterCard.jsx"},{"name":"StoryField","sourcePath":"components/surfaces/StoryField.jsx"}],"sourceHashes":{"components/actions/IssueTab.jsx":"e9a33f321c8a","components/actions/NavButton.jsx":"e13c366bc4ae","components/actions/Pill.jsx":"7eab04b26a16","components/actions/ShareButton.jsx":"1c9ff6234caa","components/core/Icon.jsx":"2cc885eb670b","components/feed/ActionBar.jsx":"d19835359e82","components/feed/Avatar.jsx":"16209bd3ed72","components/feed/NavDots.jsx":"aad4f6e2258e","components/feed/StatBlock.jsx":"59c61c78584f","components/surfaces/PhoneFrame.jsx":"3db6aaee6f66","components/surfaces/PosterCard.jsx":"412b785a4aa9","components/surfaces/StoryField.jsx":"d839219c8a3d","ui_kits/dsotr_feed/Feed.jsx":"745562826ce3","ui_kits/dsotr_feed/posters.js":"48eeb8ec4b38"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DarkSideOfTheRainbowDesignSystem_939f41 = window.DarkSideOfTheRainbowDesignSystem_939f41 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/IssueTab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IssueTab — the issue selector chip (Suicide · Bullying · Identity · …).
 * active = filled ink chip with paper label; inactive = soft Sand ghost.
 */
function IssueTab({
  children,
  active = false,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    "aria-pressed": active,
    style: {
      appearance: "none",
      cursor: "pointer",
      padding: "8px 16px",
      borderRadius: "var(--radius-sm)",
      background: active ? "var(--ink)" : "var(--gray-100)",
      color: active ? "var(--paper)" : "var(--ink)",
      border: active ? "1px solid var(--ink)" : "1px solid var(--sand)",
      font: `${active ? "var(--fw-bold)" : "var(--fw-medium)"} 13px/1 var(--font-sans)`,
      whiteSpace: "nowrap",
      transition: "background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)",
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = "scale(0.96)",
    onMouseUp: e => e.currentTarget.style.transform = "scale(1)",
    onMouseLeave: e => e.currentTarget.style.transform = "scale(1)"
  }, rest), children);
}
Object.assign(__ds_scope, { IssueTab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IssueTab.jsx", error: String((e && e.message) || e) }); }

// components/actions/NavButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * NavButton — the bottom-bar navigation control. Two looks:
 *   variant="solid"  → filled ink with paper text ("Next »", primary)
 *   variant="ghost"  → paper with a 1px Sand hairline ("« Back", secondary)
 * Press shrinks slightly; ghost darkens its border on hover.
 */
function NavButton({
  children,
  variant = "ghost",
  onClick,
  full = false,
  style,
  ...rest
}) {
  const solid = variant === "solid";
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      appearance: "none",
      cursor: "pointer",
      width: full ? "100%" : undefined,
      minWidth: 120,
      padding: "11px 22px",
      borderRadius: "var(--radius-sm)",
      background: solid ? "var(--ink)" : "var(--paper)",
      color: solid ? "var(--paper)" : "var(--ink)",
      border: solid ? "1px solid var(--ink)" : "1px solid var(--sand)",
      font: "var(--fw-medium) 13px/1 var(--font-sans)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      transition: "transform var(--dur-fast) var(--ease-standard), border-color var(--dur-base) var(--ease-standard), background var(--dur-base) var(--ease-standard)",
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = "scale(0.97)",
    onMouseUp: e => e.currentTarget.style.transform = "scale(1)",
    onMouseLeave: e => e.currentTarget.style.transform = "scale(1)"
  }, rest), children);
}

/**
 * NavSquare — the numbered poster selector (the right-hand stack 1–5).
 * active = filled ink with white numeral; inactive = ghost outline.
 */
function NavSquare({
  index,
  active = false,
  onClick,
  size = 56,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    "aria-pressed": active,
    style: {
      appearance: "none",
      cursor: "pointer",
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: active ? "var(--ink)" : "transparent",
      border: `${Math.max(2, size * 0.06)}px solid var(--ink)`,
      color: active ? "var(--white)" : "var(--ink)",
      font: `var(--fw-bold) ${Math.round(size * 0.36)}px/1 var(--font-sans)`,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform var(--dur-fast) var(--ease-standard)",
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = "scale(0.94)",
    onMouseUp: e => e.currentTarget.style.transform = "scale(1)",
    onMouseLeave: e => e.currentTarget.style.transform = "scale(1)"
  }, rest), index);
}
Object.assign(__ds_scope, { NavButton, NavSquare });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/NavButton.jsx", error: String((e && e.message) || e) }); }

// components/actions/Pill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pill — small status / action chip. The "Follow" pill is the canonical
 * use (soft grey). variant: "ghost" (grey), "outline" (sand hairline),
 * "solid" (ink), "spectrum" (CMYK gradient — reserve for share/CTA).
 */
function Pill({
  children,
  variant = "ghost",
  onClick,
  as = "span",
  style,
  ...rest
}) {
  const looks = {
    ghost: {
      background: "var(--gray-100)",
      color: "var(--ink)",
      border: "1px solid transparent"
    },
    outline: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--sand)"
    },
    solid: {
      background: "var(--ink)",
      color: "var(--paper)",
      border: "1px solid var(--ink)"
    },
    spectrum: {
      background: "var(--gradient-cmyk)",
      imageRendering: "pixelated",
      color: "var(--ink)",
      border: "1px solid transparent"
    }
  };
  const look = looks[variant] || looks.ghost;
  const Tag = onClick ? "button" : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: onClick ? "button" : undefined,
    onClick: onClick,
    style: {
      appearance: "none",
      cursor: onClick ? "pointer" : "default",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 12px",
      borderRadius: "var(--radius-sm)",
      font: "var(--fw-medium) 12px/1 var(--font-sans)",
      ...look,
      ...style
    }
  }, rest), children);
}

/**
 * Tag — a tiny 2px-radius label, for issue / category metadata.
 */
function Tag({
  children,
  tone = "ink",
  style,
  ...rest
}) {
  const tones = {
    ink: {
      background: "var(--ink)",
      color: "var(--paper)"
    },
    sand: {
      background: "var(--sand-soft)",
      color: "var(--ink)"
    },
    pink: {
      background: "var(--pink)",
      color: "var(--white)"
    },
    teal: {
      background: "var(--teal)",
      color: "var(--white)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 8px",
      borderRadius: "var(--radius-xs)",
      font: "var(--fw-bold) 10px/1 var(--font-sans)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      ...(tones[tone] || tones.ink),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Pill, Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Pill.jsx", error: String((e && e.message) || e) }); }

// components/actions/ShareButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ShareButton — the signature CMYK-gradient pill. The one place the
 * loud spectrum lands on UI chrome. Label is conventionally "SHARE »".
 */
function ShareButton({
  children = "SHARE \u00BB",
  onClick,
  size = "md",
  style,
  ...rest
}) {
  const pad = size === "sm" ? "7px 16px" : size === "lg" ? "14px 30px" : "10px 22px";
  const fs = size === "sm" ? 11 : size === "lg" ? 15 : 13;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      appearance: "none",
      border: 0,
      cursor: "pointer",
      padding: pad,
      borderRadius: "var(--radius-sm)",
      background: "var(--gradient-cmyk)",
      imageRendering: "pixelated",
      color: "var(--ink)",
      font: `var(--fw-black) ${fs}px/1 var(--font-sans)`,
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform var(--dur-fast) var(--ease-standard), filter var(--dur-fast) var(--ease-standard)",
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = "scale(0.97)",
    onMouseUp: e => e.currentTarget.style.transform = "scale(1)",
    onMouseLeave: e => e.currentTarget.style.transform = "scale(1)"
  }, rest), children);
}
Object.assign(__ds_scope, { ShareButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/ShareButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The Dark Side of the Rainbow icon set — the borrowed Instagram chrome.
 * Flat, single-weight outline glyphs (≈1.5–2px stroke, rounded joins),
 * recoloured to ink via `currentColor`. Geometry is lifted verbatim from
 * the project's own SVG assets (SVG Repo outline family).
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const ICONS = {
  heart: {
    vb: "0 0 24 24",
    render: () => /*#__PURE__*/React.createElement("path", _extends({}, STROKE, {
      d: "M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
    }))
  },
  send: {
    vb: "0 0 24 24",
    render: () => /*#__PURE__*/React.createElement("path", _extends({}, STROKE, {
      d: "M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
    }))
  },
  comment: {
    vb: "0 0 24 24",
    render: () => /*#__PURE__*/React.createElement("path", _extends({}, STROKE, {
      d: "M7.5 19.5L4 21.5V7.4C4 6.6 4.3 5.9 4.9 5.3C5.5 4.7 6.2 4.4 7 4.4H17C17.8 4.4 18.5 4.7 19.1 5.3C19.7 5.9 20 6.6 20 7.4V14.5C20 15.3 19.7 16 19.1 16.6C18.5 17.2 17.8 17.5 17 17.5H9.5C8.8 17.5 8.1 17.8 7.5 18.2"
    }))
  },
  bookmark: {
    vb: "0 0 24 24",
    render: () => /*#__PURE__*/React.createElement("path", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinejoin: "round",
      d: "M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z"
    })
  },
  plus: {
    vb: "0 0 24 24",
    render: () => /*#__PURE__*/React.createElement("path", _extends({}, STROKE, {
      d: "M4 12H20M12 4V20"
    }))
  },
  profile: {
    vb: "0 0 24 24",
    render: () => /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
    }))
  },
  dots: {
    vb: "0 0 16 16",
    render: () => /*#__PURE__*/React.createElement("g", {
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 2C10 0.89543 9.10457 -4.82823e-08 8 0C6.89543 4.82823e-08 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z"
    }))
  }
};
function Icon({
  name = "heart",
  size = 24,
  color,
  style,
  title,
  ...rest
}) {
  const def = ICONS[name] || ICONS.heart;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: def.vb,
    role: title ? "img" : "presentation",
    "aria-hidden": title ? undefined : "true",
    "aria-label": title,
    style: {
      display: "block",
      color: color || "currentColor",
      flexShrink: 0,
      ...style
    }
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, def.render());
}
const ICON_NAMES = Object.keys(ICONS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/feed/ActionBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function fmt(n) {
  if (typeof n !== "number") return n;
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
  return String(n);
}

/**
 * ActionBar — the Instagram action row beneath every poster:
 * heart · comment · send (with counts) … bookmark on the far right.
 * `dark` flips the ink to white for solution pages.
 */
function ActionBar({
  likes = 30200,
  comments = 32,
  shares = 4101,
  liked = false,
  saved = false,
  dark = false,
  onLike,
  onComment,
  onShare,
  onSave,
  style,
  ...rest
}) {
  const ink = dark ? "var(--white)" : "var(--ink)";
  const item = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: 0,
    padding: 0,
    cursor: "pointer",
    color: ink,
    font: "var(--fw-medium) 13px/1 var(--font-sans)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      color: ink,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      ...item,
      color: liked ? "var(--like-red)" : ink
    },
    onClick: onLike
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "heart",
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: ink
    }
  }, fmt(likes))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: item,
    onClick: onComment
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "comment",
    size: 22
  }), /*#__PURE__*/React.createElement("span", null, fmt(comments))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: item,
    onClick: onShare
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "send",
    size: 22
  }), /*#__PURE__*/React.createElement("span", null, fmt(shares))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      ...item,
      marginLeft: "auto"
    },
    onClick: onSave,
    "aria-pressed": saved
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "bookmark",
    size: 22,
    style: {
      fill: saved ? ink : "none"
    }
  })));
}
Object.assign(__ds_scope, { ActionBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/ActionBar.jsx", error: String((e && e.message) || e) }); }

// components/feed/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — round profile image. Falls back to a neutral grey disc with
 * the profile glyph (matching the feed's empty "You" state). An optional
 * spectral ring nods to the brand's gradient.
 */
function Avatar({
  src,
  alt = "",
  size = 40,
  ring = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-pill)",
      background: src ? "transparent" : "var(--gray-300)",
      color: "var(--ink-500)",
      overflow: "hidden",
      flexShrink: 0,
      padding: ring ? 2 : 0,
      backgroundImage: ring ? "var(--gradient-cmyk)" : undefined,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      borderRadius: "var(--radius-pill)",
      background: src ? "transparent" : "var(--gray-300)",
      overflow: "hidden"
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "profile",
    size: Math.round(size * 0.62)
  })));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/feed/NavDots.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * NavDots — the progress indicator in the bottom bar.
 * variant="dot" (default): round dots — ink active, filled Sand visited,
 *   hollow Sand ring upcoming.
 * variant="pill": a pill progress bar — the active step is a wide ink pill,
 *   the rest are short Sand pills.
 */
function NavDots({
  count = 3,
  index = 0,
  onDot,
  variant = "dot",
  style,
  ...rest
}) {
  const pill = variant === "pill";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: pill ? 6 : 10,
      ...style
    }
  }, rest), Array.from({
    length: count
  }).map((_, i) => {
    const active = i === index;
    const visited = i < index;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: onDot ? () => onDot(i) : undefined,
      "aria-current": active ? "true" : undefined,
      style: {
        width: pill ? active ? 26 : 10 : 12,
        height: pill ? 8 : 12,
        padding: 0,
        borderRadius: "var(--radius-pill)",
        cursor: onDot ? "pointer" : "default",
        background: active ? "var(--ink)" : visited ? "var(--sand)" : pill ? "var(--sand-soft)" : "transparent",
        border: pill ? "0" : active ? "0" : "1.5px solid var(--sand)",
        transition: "width var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-standard)"
      }
    });
  }));
}
Object.assign(__ds_scope, { NavDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/NavDots.jsx", error: String((e && e.message) || e) }); }

// components/feed/StatBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatBlock — the hero statistic. A giant Inter Black numeral with a
 * smaller superscript unit (%, "in 10", …) and the explanatory sentence
 * flowing beneath. `dark` inverts to white for solution pages.
 *
 * Body copy supports the brand's surgical bold: pass an array of segments
 * `[{ t, b }]` or plain children.
 */
function StatBlock({
  value = "39",
  unit = "%",
  size = 132,
  dark = false,
  segments,
  children,
  style,
  ...rest
}) {
  const ink = dark ? "var(--white)" : "var(--ink)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      color: ink,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      lineHeight: 0.82
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--fw-black) ${size}px/0.82 var(--font-sans)`,
      letterSpacing: "var(--ls-display)"
    }
  }, value), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--fw-bold) ${Math.round(size * 0.46)}px/1 var(--font-sans)`,
      marginTop: size * 0.1,
      marginLeft: 4
    }
  }, unit) : null), (segments || children) && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      maxWidth: 460,
      font: "var(--fw-regular) 16px/1.45 var(--font-sans)",
      color: ink,
      textWrap: "pretty"
    }
  }, segments ? segments.map((s, i) => s.b ? /*#__PURE__*/React.createElement("strong", {
    key: i,
    style: {
      fontWeight: 700
    }
  }, s.t) : /*#__PURE__*/React.createElement("span", {
    key: i
  }, s.t)) : children));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/PhoneFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PhoneFrame — the device shell every poster lives in. Pure-black bezel
 * with the signature 36px curve and a 9px-radius white screen inside.
 * A floating shadow lifts it off the paper.
 */
function PhoneFrame({
  children,
  width = 360,
  height = 640,
  bezel = 14,
  screen = "var(--white)",
  float = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height,
      background: "var(--black)",
      borderRadius: "var(--radius-phone)",
      padding: bezel,
      boxShadow: float ? "var(--shadow-phone)" : "none",
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: screen,
      borderRadius: "calc(var(--radius-phone) - " + bezel + "px)",
      overflow: "hidden",
      position: "relative"
    }
  }, children));
}
Object.assign(__ds_scope, { PhoneFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/PosterCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PosterCard — a full Instagram poster card: header (avatar · handle ·
 * Follow · ⋮), the two-sided poster image area, the action row, and the
 * clipped caption. Tapping the image flips light "problem" ↔ dark
 * "solution". Drive it controlled (`state` + `onToggle`) or let it manage
 * its own flip state.
 *
 * `poster` shape:
 *   { title, subtitle, image, imageDark,
 *     stat, unit, problem:[{t,b}], cta,
 *     lead, support, stat2, unit2, closing:[{t,b}] }
 */
function PosterCard({
  poster,
  username = "dark.side.rainbow",
  state,
  onToggle,
  likes = 30200,
  comments = 32,
  shares = 4101,
  width = 360,
  style,
  ...rest
}) {
  const p = poster || {};
  const [selfState, setSelfState] = React.useState("light");
  const st = state ?? selfState;
  const dark = st === "dark";
  const flip = () => {
    if (onToggle) onToggle(dark ? "light" : "dark");else setSelfState(dark ? "light" : "dark");
  };
  const imgSrc = dark ? p.imageDark || p.image : p.image;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      background: "var(--white)",
      border: "1px solid var(--sand)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    size: 34
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-bold) 14px/1 var(--font-sans)",
      color: "var(--ink)"
    }
  }, username), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Pill, {
    variant: "ghost"
  }, "Follow"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "dots",
    size: 16
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: flip,
    style: {
      appearance: "none",
      border: 0,
      padding: 0,
      cursor: "pointer",
      position: "relative",
      width: "100%",
      aspectRatio: "1 / 1.25",
      background: dark ? "var(--black)" : "var(--paper)",
      overflow: "hidden",
      textAlign: "left",
      display: "block",
      transition: "background var(--dur-base) var(--ease-standard)"
    }
  }, imgSrc && /*#__PURE__*/React.createElement("img", {
    src: imgSrc,
    alt: "",
    style: {
      position: "absolute",
      right: "-8%",
      top: "50%",
      transform: "translateY(-50%)",
      height: "118%",
      objectFit: "contain",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      top: 16,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-black) 17px/1.05 var(--font-sans)",
      letterSpacing: "-0.02em",
      color: dark ? "var(--white)" : "var(--ink)"
    }
  }, "Dark Side of The Rainbow"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-medium) 10px/1.3 var(--font-sans)",
      color: dark ? "var(--white)" : "var(--ink)",
      marginTop: 3
    }
  }, p.subtitle || "Mental Health Struggles of LGBTQ+ Youth")), !dark ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      bottom: 16,
      right: 16,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    value: p.stat || "39",
    unit: p.unit ?? "%",
    size: 68,
    segments: p.problem
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      font: "var(--fw-bold) 18px/1 var(--font-sans)",
      color: "var(--ink)",
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, p.cta || "You Can Help Them", " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u203A\u203A"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      top: 70,
      right: 16,
      bottom: 16,
      zIndex: 2,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-regular) 16px/1.2 var(--font-sans)",
      color: "var(--white)"
    }
  }, p.lead || "LGBTQ+ youth who have at least"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-bold) 40px/0.95 var(--font-sans)",
      color: "var(--white)",
      whiteSpace: "pre-line",
      marginTop: 6,
      letterSpacing: "-0.01em"
    }
  }, p.support || "1 Accepting\nAdult"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    value: p.stat2 || "40",
    unit: p.unit2 ?? "%",
    size: 62,
    dark: true,
    segments: p.closing
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px 16px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ActionBar, {
    likes: likes,
    comments: comments,
    shares: shares
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      font: "var(--fw-regular) 13px/1.4 var(--font-sans)",
      color: "var(--ink)"
    }
  }, "Liked by ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 700
    }
  }, username), " and others"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      font: "var(--fw-regular) 13px/1.4 var(--font-sans)",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 700
    }
  }, username), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-700)"
    }
  }, p.caption || "Tap to see how you can help."), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-500)"
    }
  }, "more")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      font: "var(--fw-medium) 11px/1 var(--font-sans)",
      color: "var(--ink-500)",
      letterSpacing: "0.04em"
    }
  }, "JUNE 11, 2025")));
}
Object.assign(__ds_scope, { PosterCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/PosterCard.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/StoryField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StoryField — the "Add Your Story" composer. A large display heading
 * over a paper textarea held by the signature 1px Sand hairline.
 * Placeholder copy keeps the authentic UGC voice ("This issue effects me…").
 */
function StoryField({
  heading = "Add Your\nStory",
  gradientHeading = false,
  value,
  defaultValue,
  onChange,
  placeholder = "This issue effects me\u2026",
  rows = 8,
  style,
  ...rest
}) {
  const gradientStyle = gradientHeading ? {
    background: "var(--gradient-cmyk)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent"
  } : {
    color: "var(--ink)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      ...style
    }
  }, rest), heading != null && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: "var(--fw-black) 44px/1 var(--font-sans)",
      letterSpacing: "var(--ls-display)",
      whiteSpace: "pre-line",
      ...gradientStyle
    }
  }, heading), /*#__PURE__*/React.createElement("textarea", {
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    rows: rows,
    style: {
      width: "100%",
      resize: "none",
      boxSizing: "border-box",
      padding: "16px 18px",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--sand)",
      background: "var(--paper)",
      color: "var(--ink)",
      font: "var(--fw-regular) 16px/1.5 var(--font-sans)",
      outline: "none"
    },
    onFocus: e => e.currentTarget.style.borderColor = "var(--ink)",
    onBlur: e => e.currentTarget.style.borderColor = "var(--sand)"
  }));
}
Object.assign(__ds_scope, { StoryField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/StoryField.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dsotr_feed/Feed.jsx
try { (() => {
/* global React */
const {
  useState,
  useRef,
  useEffect
} = React;
const DS = window.DarkSideOfTheRainbowDesignSystem_939f41 || {};
const {
  PhoneFrame,
  IssueTab,
  NavButton,
  NavDots,
  ShareButton,
  StoryField,
  Avatar,
  ActionBar,
  StatBlock,
  Icon
} = DS;
const ISSUES = window.DSOTR_POSTERS || [];

// ---- The five 3D models, with the per-model viewer params from the
// original sketch. The issue (text) and the model (geometry) are chosen
// independently so users can mix & match. ----
const MODELS = [{
  key: "head",
  label: "Head",
  obj: "femalehead",
  thumb: "../../assets/picker/head.png",
  ambCmy: 0.6,
  ambRgb: 0.9,
  spread: 0.8,
  ox: 0.55,
  oy: -0.10,
  scale: 1.3
}, {
  key: "fist",
  label: "Fist",
  obj: "fist",
  thumb: "../../assets/picker/fist.png",
  ambCmy: 0.29,
  ambRgb: 0.29,
  spread: 0.98,
  ox: 0.45,
  oy: -0.10,
  scale: 1.3
}, {
  key: "eye",
  label: "Eye",
  obj: "eye",
  thumb: "../../assets/picker/eye.png",
  ambCmy: 0.6,
  ambRgb: 0.5,
  spread: 0.8,
  ox: 0.5,
  oy: -0.08,
  scale: 1.25
}, {
  key: "hand",
  label: "Hand",
  obj: "hand",
  thumb: "../../assets/picker/hand.png",
  ambCmy: 0.6,
  ambRgb: 0.9,
  spread: 0.8,
  ox: 0.45,
  oy: -0.08,
  scale: 1.2
}, {
  key: "mouth",
  label: "Mouth",
  obj: "mouth",
  thumb: "../../assets/picker/mouth.png",
  ambCmy: 0.7,
  ambRgb: 0.9,
  spread: 0.2,
  spreadRgb: 0.5,
  ox: 0.55,
  oy: 0.0,
  scale: 1.3
}];
const VIEWER = "https://cmyk-stack-viewer.vercel.app/";
function modelURL(m, mode) {
  const amb = mode === "light" ? m.ambCmy : m.ambRgb;
  const spread = mode === "dark" && m.spreadRgb != null ? m.spreadRgb : m.spread;
  const color = mode === "light" ? "cmy" : "rgb";
  const objs = encodeURIComponent(JSON.stringify([{
    type: m.obj
  }]));
  return VIEWER + "?embed=1&slices=14&contrast=0.97&light=1.80&rotateSpeed=0.8&camera=diagonal" + "&spread=" + spread + "&ambient=" + amb + "&color=" + color + "&offsetX=" + m.ox + "&offsetY=" + m.oy + "&scale=" + m.scale + "&objects=" + objs;
}
function TopBar({
  step
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px 8px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-bold) 11px/1 var(--font-sans)",
      letterSpacing: "0.06em",
      color: "var(--ink)"
    }
  }, "DSOTR"), /*#__PURE__*/React.createElement(NavDots, {
    count: 3,
    index: step,
    variant: "pill"
  }));
}

// ---- The live poster: viewer iframe (provides cream/black bg + the
// prismatic model) with the issue text laid over it. ----
function LivePoster({
  issue,
  model,
  mode,
  rounded = 0,
  compact = false
}) {
  const dark = mode === "dark";
  const ink = dark ? "var(--white)" : "var(--ink)";
  const bg = dark ? "#0C0D10" : "#F6F1E7";
  const titleSize = compact ? 15 : 19;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: bg,
      borderRadius: rounded,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    title: "poster",
    src: modelURL(model, mode),
    loading: "lazy",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      border: 0,
      background: bg,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: compact ? 16 : 20,
      top: compact ? 14 : 20,
      zIndex: 2,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: `var(--fw-black) ${titleSize}px/1.03 var(--font-sans)`,
      letterSpacing: "-0.02em",
      color: ink
    }
  }, "Dark Side of The Rainbow"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-medium) 10px/1.3 var(--font-sans)",
      color: ink,
      marginTop: 3
    }
  }, "Mental Health Struggles of LGBTQ+ Youth")), !dark ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: compact ? 16 : 20,
      bottom: compact ? 14 : 25,
      right: compact ? 14 : 18,
      zIndex: 2,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      lineHeight: 0.82,
      color: ink
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--fw-black) ${compact ? 54 : 80}px/0.82 var(--font-sans)`,
      letterSpacing: 0
    }
  }, issue.stat), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--fw-bold) ${compact ? 26 : 30}px/1 var(--font-sans)`,
      marginTop: compact ? 6 : 8,
      marginLeft: 3
    }
  }, issue.unit)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: `${compact ? 8 : 10}px ${compact ? 0 : 60}px ${compact ? 0 : 45}px 0`,
      font: `var(--fw-regular) ${compact ? 11.5 : 12}px/${compact ? "1.4" : "16px"} var(--font-sans)`,
      color: ink,
      textWrap: "pretty"
    }
  }, issue.problem.map((s, i) => s.b ? /*#__PURE__*/React.createElement("strong", {
    key: i,
    style: {
      fontWeight: 700
    }
  }, s.t) : /*#__PURE__*/React.createElement("span", {
    key: i
  }, s.t))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: compact ? 10 : 14,
      font: `var(--fw-bold) ${compact ? 15 : 18}px/1 var(--font-sans)`,
      color: ink,
      display: "flex",
      gap: 4
    }
  }, issue.cta, " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u203A\u203A"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: compact ? 16 : 20,
      top: compact ? 60 : 189,
      right: compact ? 14 : 18,
      bottom: compact ? 14 : 25,
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: `var(--fw-regular) ${compact ? 14 : 16}px/1.2 var(--font-sans)`,
      color: ink
    }
  }, issue.lead), /*#__PURE__*/React.createElement("div", {
    style: {
      font: `var(--fw-bold) ${compact ? 32 : 38}px/0.95 var(--font-sans)`,
      color: ink,
      whiteSpace: "pre-line",
      marginTop: 6,
      letterSpacing: "-0.01em"
    }
  }, issue.support), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "flex",
      alignItems: "flex-end",
      lineHeight: 0.82,
      color: ink
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--fw-black) ${compact ? 50 : 80}px/0.82 var(--font-sans)`,
      letterSpacing: 0
    }
  }, issue.stat2), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--fw-bold) ${compact ? 24 : 28}px/1 var(--font-sans)`,
      marginTop: compact ? 5 : 7,
      marginLeft: 3
    }
  }, issue.unit2)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      font: `var(--fw-regular) ${compact ? 13 : 15}px/1.35 var(--font-sans)`,
      color: ink,
      textWrap: "pretty"
    }
  }, issue.closing.map((s, i) => s.b ? /*#__PURE__*/React.createElement("strong", {
    key: i,
    style: {
      fontWeight: 700
    }
  }, s.t) : /*#__PURE__*/React.createElement("span", {
    key: i
  }, s.t)))));
}

// ---- Reusable swipeable poster: two panels (light|dark) on a sliding track ----
function SwipePreview({
  issueIdx,
  modelIdx,
  mode,
  setMode,
  compact = false,
  rounded = 5,
  style
}) {
  const drag = useRef(null);
  const onDown = e => {
    drag.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const onUp = e => {
    if (drag.current == null) return;
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const dx = x - drag.current;
    if (Math.abs(dx) > 40) setMode(dx < 0 ? "dark" : "light");
    drag.current = null;
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseDown: onDown,
    onMouseUp: onUp,
    onTouchStart: onDown,
    onTouchEnd: onUp,
    style: {
      position: "relative",
      overflow: "hidden",
      cursor: "grab",
      userSelect: "none",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      width: "200%",
      transform: mode === "dark" ? "translateX(-50%)" : "translateX(0)",
      transition: "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "50%",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(LivePoster, {
    issue: ISSUES[issueIdx],
    model: MODELS[modelIdx],
    mode: "light",
    rounded: rounded,
    compact: compact
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "50%",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(LivePoster, {
    issue: ISSUES[issueIdx],
    model: MODELS[modelIdx],
    mode: "dark",
    rounded: rounded,
    compact: compact
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      zIndex: 3,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMode("light"),
    style: {
      all: "unset",
      cursor: "pointer",
      pointerEvents: "auto",
      width: 8,
      height: 8,
      borderRadius: 999,
      background: mode === "light" ? mode === "dark" ? "#fff" : "var(--ink)" : "rgba(140,140,140,0.55)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMode("dark"),
    style: {
      all: "unset",
      cursor: "pointer",
      pointerEvents: "auto",
      width: 8,
      height: 8,
      borderRadius: 999,
      background: mode === "dark" ? "#fff" : "rgba(140,140,140,0.55)"
    }
  })));
}

// ---- Screen 1 : Creator — pick issue + model, swipe the preview ----
function Creator({
  issueIdx,
  setIssueIdx,
  modelIdx,
  setModelIdx,
  mode,
  setMode
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px 8px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      flexShrink: 0
    }
  }, [ISSUES.slice(0, 3), ISSUES.slice(3)].map((row, r) => /*#__PURE__*/React.createElement("div", {
    key: r,
    style: {
      display: "flex",
      gap: 6
    }
  }, row.map(it => {
    const i = ISSUES.indexOf(it);
    return /*#__PURE__*/React.createElement(IssueTab, {
      key: it.name,
      active: i === issueIdx,
      onClick: () => setIssueIdx(i),
      style: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        padding: "9px 8px",
        background: i === issueIdx ? "var(--ink)" : "var(--sand-soft)"
      }
    }, it.name);
  })))), /*#__PURE__*/React.createElement(SwipePreview, {
    issueIdx: issueIdx,
    modelIdx: modelIdx,
    mode: mode,
    setMode: setMode,
    rounded: 5,
    style: {
      flex: 1,
      margin: "0 16px",
      border: "1px solid var(--sand)",
      borderRadius: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      padding: "10px 16px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, MODELS.map((m, i) => {
    const sel = i === modelIdx;
    return /*#__PURE__*/React.createElement("button", {
      key: m.key,
      type: "button",
      onClick: () => setModelIdx(i),
      style: {
        flex: 1,
        aspectRatio: "1",
        padding: 0,
        cursor: "pointer",
        borderRadius: 10,
        overflow: "hidden",
        background: sel ? "var(--ink)" : "var(--sand-soft)",
        border: sel ? "2px solid var(--ink)" : "1px solid var(--sand)"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: m.thumb,
      alt: m.label,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block"
      }
    }));
  }))));
}

// ---- Screen 2 : Add Your Story ----
function Story({
  story,
  setStory
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "10px 20px"
    }
  }, /*#__PURE__*/React.createElement(StoryField, {
    className: "cmy-heading",
    heading: "Add\nYour Story",
    value: story,
    onChange: e => setStory(e.target.value),
    rows: 11
  })));
}

// ---- Screen 3 : Instagram mockup of their post ----
function Mockup({
  issueIdx,
  modelIdx,
  mode,
  setMode,
  story,
  shared
}) {
  const issue = ISSUES[issueIdx];
  const caption = story && story.trim() ? story.trim() : issue.caption;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 12px 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--white)",
      border: "1px solid var(--sand)",
      borderRadius: 12,
      overflow: "hidden",
      height: "100%",
      position: "static"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      height: 32
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 34
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-bold) 14px/1 var(--font-sans)",
      color: "var(--ink)"
    }
  }, "you"), shared && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-medium) 11px/1 var(--font-sans)",
      color: "var(--ink-500)"
    }
  }, "\xB7 just now"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      color: "var(--ink)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dots",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: "1 / 1.5"
    }
  }, /*#__PURE__*/React.createElement(SwipePreview, {
    issueIdx: issueIdx,
    modelIdx: modelIdx,
    mode: mode,
    setMode: setMode,
    rounded: 5,
    style: {
      position: "absolute",
      inset: 0
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px 12px"
    }
  }, /*#__PURE__*/React.createElement(ActionBar, {
    likes: shared ? 1 : 0,
    comments: 0,
    shares: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      marginBottom: 6,
      font: "var(--fw-regular) 13px/1.4 var(--font-sans)",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 700
    }
  }, "you"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-700)"
    }
  }, caption))))));
}

// ---- Bottom navigation bar — 3-zone grid keeps the progress always centered ----
function BottomBar({
  step,
  setStep,
  shared,
  onShare
}) {
  const bar = {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "10px 14px 14px",
    flexShrink: 0
  };
  const left = {
    justifySelf: "start"
  };
  const right = {
    justifySelf: "end"
  };
  const center = {
    justifySelf: "center"
  };
  const back = to => /*#__PURE__*/React.createElement(NavButton, {
    variant: "ghost",
    onClick: () => setStep(to)
  }, "\xAB Back");
  const next = to => /*#__PURE__*/React.createElement(NavButton, {
    variant: "solid",
    onClick: () => setStep(to)
  }, "Next \xBB");
  return /*#__PURE__*/React.createElement("div", {
    style: bar
  }, /*#__PURE__*/React.createElement("div", {
    style: left
  }, step > 0 ? back(step - 1) : null), /*#__PURE__*/React.createElement("div", {
    style: center
  }), /*#__PURE__*/React.createElement("div", {
    style: right
  }, step < 2 ? next(step + 1) : shared ? /*#__PURE__*/React.createElement(NavButton, {
    variant: "ghost",
    onClick: () => setStep(0)
  }, "Done") : /*#__PURE__*/React.createElement(ShareButton, {
    onClick: onShare,
    style: {
      background: "var(--ink)",
      color: "var(--paper)",
      imageRendering: "auto",
      minWidth: 120,
      padding: "11px 22px",
      fontSize: 13,
      border: "1px solid var(--ink)"
    }
  }, "SHARE \xBB")));
}
function Creator2() {
  const [step, setStep] = useState(0);
  const [issueIdx, setIssueIdx] = useState(0);
  const [modelIdx, setModelIdx] = useState(0);
  const [mode, setMode] = useState("light");
  const [story, setStory] = useState("");
  const [shared, setShared] = useState(false);

  // Reset the "shared" flag whenever they go back to edit.
  useEffect(() => {
    if (step < 2) setShared(false);
  }, [step]);
  let screen;
  if (step === 0) screen = /*#__PURE__*/React.createElement(Creator, {
    issueIdx: issueIdx,
    setIssueIdx: setIssueIdx,
    modelIdx: modelIdx,
    setModelIdx: setModelIdx,
    mode: mode,
    setMode: setMode
  });else if (step === 1) screen = /*#__PURE__*/React.createElement(Story, {
    story: story,
    setStory: setStory
  });else screen = /*#__PURE__*/React.createElement(Mockup, {
    issueIdx: issueIdx,
    modelIdx: modelIdx,
    mode: mode,
    setMode: setMode,
    story: story,
    shared: shared
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--paper-screen)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(PhoneFrame, {
    width: 372,
    height: 740,
    screen: "var(--paper)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    step: step
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0
    }
  }, screen), /*#__PURE__*/React.createElement(BottomBar, {
    step: step,
    setStep: setStep,
    shared: shared,
    onShare: () => setShared(true)
  }))));
}
window.DSOTRFeed = Creator2;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dsotr_feed/Feed.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dsotr_feed/posters.js
try { (() => {
// The five Dark Side of the Rainbow posters — text + imagery for each
// issue, lifted verbatim from the project's p5 sketch. Exposed on
// window.DSOTR_POSTERS for the feed UI kit.
window.DSOTR_POSTERS = [{
  name: "Suicide",
  thumb: "../../assets/thumbs/head.png",
  image: "../../assets/posters/head-cmy.png",
  imageDark: "../../assets/posters/head-rgb.png",
  caption: "Suicidal ideation among LGBTQ+ youth. Tap to see how you can help.",
  stat: "39",
  unit: "%",
  problem: [{
    t: "of young LGBTQ+ members seriously "
  }, {
    t: "considered attempting suicide",
    b: true
  }, {
    t: " in the past year including 46% of transgender and nonbinary young people. LGBTQ+ youth of color reported higher rates than White peers."
  }],
  cta: "You Can Help Them",
  lead: "LGBTQ+ youth who have at least",
  support: "1 Accepting\nAdult",
  stat2: "40",
  unit2: "%",
  closing: [{
    t: "less likely",
    b: true
  }, {
    t: " to report a suicide attempt"
  }]
}, {
  name: "Bullying",
  thumb: "../../assets/thumbs/fist.png",
  image: "../../assets/posters/head-cmy.png",
  imageDark: "../../assets/posters/head-rgb.png",
  caption: "Bullying and harassment at school. Tap to see how you can help.",
  stat: "83",
  unit: "%",
  problem: [{
    t: "of LGBTQ+ students "
  }, {
    t: "experienced harassment or assault",
    b: true
  }, {
    t: " at school based on who they are, including 32% who missed at least one day of school in the past month because they felt unsafe."
  }],
  cta: "You Can Help Them",
  lead: "LGBTQ+ students who have at least",
  support: "1 Supportive\nEducator",
  stat2: "55",
  unit2: "%",
  closing: [{
    t: "less likely",
    b: true
  }, {
    t: " to miss school out of fear"
  }]
}, {
  name: "Identity",
  thumb: "../../assets/thumbs/eye.png",
  image: "../../assets/posters/head-cmy.png",
  imageDark: "../../assets/posters/head-rgb.png",
  caption: "Identity, pronouns and being seen. Tap to see how you can help.",
  stat: "60",
  unit: "%",
  problem: [{
    t: "of transgender and nonbinary teens say most people in their life "
  }, {
    t: "don't respect their pronouns.",
    b: true
  }, {
    t: " Being regularly misgendered is linked to higher rates of depression, anxiety, and suicide."
  }],
  cta: "You Can Help Them",
  lead: "Trans and nonbinary youth who have",
  support: "1 Affirming\nFriend",
  stat2: "71",
  unit2: "%",
  closing: [{
    t: "fewer symptoms",
    b: true
  }, {
    t: " of severe depression"
  }]
}, {
  name: "Safety",
  thumb: "../../assets/thumbs/hand.png",
  image: "../../assets/posters/head-cmy.png",
  imageDark: "../../assets/posters/head-rgb.png",
  caption: "Access to mental health care. Tap to see how you can help.",
  stat: "50",
  unit: "%",
  problem: [{
    t: "of LGBTQ+ young people who wanted mental health care in the past year "
  }, {
    t: "were not able to get it,",
    b: true
  }, {
    t: " citing cost, fear of not being taken seriously, and not being out about who they are."
  }],
  cta: "You Can Help Them",
  lead: "LGBTQ+ youth who have at least",
  support: "1 Inclusive\nSpace",
  stat2: "38",
  unit2: "%",
  closing: [{
    t: "less likely",
    b: true
  }, {
    t: " to report a suicide attempt"
  }]
}, {
  name: "Politics",
  thumb: "../../assets/thumbs/mouth.png",
  image: "../../assets/posters/head-cmy.png",
  imageDark: "../../assets/posters/head-rgb.png",
  caption: "Politics and LGBTQ+ youth. Tap to see how you can help.",
  stat: "90",
  unit: "%",
  problem: [{
    t: "of LGBTQ+ young people say their well-being was "
  }, {
    t: "negatively impacted",
    b: true
  }, {
    t: " by recent politics, including 39% whose families have thought about moving away because of anti-LGBTQ+ laws."
  }],
  cta: "You Can Help Them",
  lead: "When affirming laws pass with",
  support: "1 Supportive\nVote",
  stat2: "14",
  unit2: "%",
  closing: [{
    t: "fewer suicide attempts",
    b: true
  }, {
    t: " among LGBTQ+ students"
  }]
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dsotr_feed/posters.js", error: String((e && e.message) || e) }); }

__ds_ns.IssueTab = __ds_scope.IssueTab;

__ds_ns.NavButton = __ds_scope.NavButton;

__ds_ns.NavSquare = __ds_scope.NavSquare;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ShareButton = __ds_scope.ShareButton;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.ActionBar = __ds_scope.ActionBar;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.NavDots = __ds_scope.NavDots;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.PhoneFrame = __ds_scope.PhoneFrame;

__ds_ns.PosterCard = __ds_scope.PosterCard;

__ds_ns.StoryField = __ds_scope.StoryField;

})();
