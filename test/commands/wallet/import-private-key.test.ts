import {expect, test} from '@oclif/test'

describe('wallet/import-private-key', () => {
  test
    .stdout()
    .command(['wallet/import-private-key'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['wallet/import-private-key', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
