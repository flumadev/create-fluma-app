const validationRegExp =
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

//Validate a string against allowed package.json names
export const validateAppName = (input: string) => {
  const paths = input.split('/');

  // If the first part is a @, it's a scoped package
  const indexOfDelimiter = paths.findIndex((p) => p.startsWith('@'));

  let appName = paths[paths.length - 1];
  if (paths.findIndex((p) => p.startsWith('@')) !== -1) {
    appName = paths.slice(indexOfDelimiter).join('/');
  }

  if (validationRegExp.test(appName ?? '')) {
    return true;
  } else {
    return 'O nome do sistema deve ser em lowercase, alfanumérico, e apenas utilizar -, _, e @';
  }
};
