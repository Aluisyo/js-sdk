import {Process} from 'mesg-js/lib/api'
import {hash} from 'mesg-js/lib/api/types'
import * as base58 from 'mesg-js/lib/util/base58'

import Command from '../../root-command'
import {IsAlreadyExistsError} from '../../utils/error'

import ProcessCompile from './compile'
import ProcessCreate from './create'
import ProcessDelete from './delete'
import ProcessLog from './logs'

export default class ProcessDev extends Command {
  static description = 'Run a process in development mode'

  static flags = {
    ...Command.flags,
    ...ProcessCompile.flags,
    ...ProcessCreate.flags,
  }

  static args = [{
    name: 'PROCESS',
    description: 'Path of the process',
    default: './'
  }]

  processCreated = false
  instanceCreated = false

  async run() {
    const {args, flags} = this.parse(ProcessDev)

    const envToArgs = (flags.env || []).reduce((prev: string[], next: string) => [...prev, '--env', next], [])
    const definition = await ProcessCompile.run([args.PROCESS, '--silent', '--dev', ...envToArgs])
    const processHash = await this.createProcess(definition)
    const stream = await ProcessLog.run([base58.encode(processHash)])

    process.once('SIGINT', async () => {
      stream.destroy()
      if (this.processCreated) await ProcessDelete.run([base58.encode(processHash), '--confirm'])
    })
  }

  async createProcess(definition: Process): Promise<hash> {
    try {
      const process = await this.api.process.create(definition)
      if (!process.hash) throw new Error('invalid hash')
      this.processCreated = true
      return process.hash
    } catch (e) {
      if (!IsAlreadyExistsError.match(e)) throw e
      this.warn('process already created')
      return new IsAlreadyExistsError(e).hash
    }
  }
}
