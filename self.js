exports.NotDefined = ({ name, available }) => `
  "${name}" error is not defined. This can happen because:
  - You forgot to define the error.
  - You mistyped the error name (they are case-sensitive).
  - There's a problem with this library. Please report it if you find any.

  These are the available errors:
  ${available.length ? '- ' + available.join('\n- ') : '[none available]'}
`;
