export default {
  cjs: 'babel',
  esm: { type: 'babel', importLibToEs: true },
  preCommit: {
    // Father preCommit is OOD. comment this tmp.
    // eslint: true,
    // prettier: true,
  },
  runtimeHelpers: true,
};
