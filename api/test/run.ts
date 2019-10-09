import { spawn } from 'child_process'

const scenarios = {
  Entrypoint: '',
  CreateDataCubeProject: '',
  CreateProjectFactTable: 'project/fact-table-test',
  CreateFactTableAttribute: 'project/add-attribute-test',
}

const promise = Object.entries(scenarios).reduce((promise, [ scenario, path ]) => {
  return promise.then(() => {
    return new Promise(async (resolve, reject) => {
      const command = `hydra-validator e2e --docs test/${scenario}.hydra.json ${process.env.BASE_URI}${path}`
      console.log(`\n------\n   ${command}\n------\n`)

      const childProcess = spawn(
        `hydra-validator`,
        [`e2e`, `--docs`, `test/${scenario}.hydra.json`, `${process.env.BASE_URI}${path}`],
        { stdio: 'inherit' })

      childProcess.on('exit', code => {
        if (code === 0) {
          resolve()
        }

        reject(new Error('Last scenario failed. Stopping'))
      })
    })
  })
}, Promise.resolve())

promise
  .then(() => console.log('done'))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
