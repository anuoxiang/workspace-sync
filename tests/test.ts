import * as sGit from 'simple-git';

const git: sGit.SimpleGit = sGit.simpleGit(
  '/home/django/Engineerings/git-test/',
);
// git.getRemotes(true).then((result) => {
//   console.log(result);
// });
test();
async function test() {
  try {
    const result = await git.getRemotes(true);
    result && result.length > 0
      ? console.log(result)
      : console.log('no repo');
  } catch (err) {
    console.log('no repo');
  }
}
