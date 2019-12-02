import { spawn } from 'child_process'
import program from 'commander'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

dotenvExpand(dotenv.config())

interface Summary {
  failures: string[];
  successCount: number;
}

program.option('--grep <pattern>', 'RegExp to filter the test cases')

program.parse(process.argv)

const scenarios = Object.entries({
  CreateDataCubeProject: '',
  'FactTable/CreateWithPut': 'project/fact-table-test',
  'FactTable/CreateWithPost': 'project/fact-table-post-test',
  'FactTable/CreateAndDelete': 'project/fact-table-created-deleted',
  'FactTable/GetWhenItDoesNotExist': 'project/fact-table-404',
  'DimensionTable/Create': 'project/dimension-table-test',
  'DimensionTable/CreateAndDelete': 'project/dimension-table-created-deleted',
  CreateFactTableAttribute: 'project/add-attribute-test',
  CreateFactTableAttributeWithDataType: 'project/attribute-datatype-test',
  'Source/WithNamesToEscape': '',
  'Source/CommaSeparated': '',
  Entrypoint: '',
})

const selectedScenarios = scenarios
  .filter(([ scenario ]) => {
    if (program.grep) {
      return scenario.match(program.grep)
    }

    return true
  })

function parseScenarios () {
  return new Promise((resolve, reject) => {
    console.log(`\n------\n   Compiling test scenarios\n------\n`)
    const childProcess = spawn('hypertest-compiler', ['test'], { stdio: 'inherit' })

    childProcess.on('exit', code => {
      if (code === 0) {
        resolve()
      }

      reject(new Error('Failed to compile test scenarios'))
    })
  })
}

function runScenarios (): Promise<Summary> {
  const summary: Summary = {
    failures: [],
    successCount: 0,
  }

  return selectedScenarios.reduce((promise, [scenario, path]) => {
    return promise.then(summary => {
      return new Promise(async resolve => {
        const command = `hydra-validator e2e --docs test/${scenario}.hydra.json ${process.env.BASE_URI}${path}`
        console.log(`\n------\n   ${command}\n------\n`)

        const childProcess = spawn(
          `hydra-validator`,
          [`e2e`, `--docs`, `test/${scenario}.hydra.json`, `${process.env.BASE_URI}${path}`, '--strict'],
          { stdio: 'inherit' })

        childProcess.on('exit', code => {
          if (code !== 0) {
            summary.failures.push(scenario)
          } else {
            summary.successCount += 1
          }

          resolve(summary)
        })
      })
    })
  }, Promise.resolve(summary))
}

function summary (summary: Summary) {
  console.log(`\n------\n   Summary\n------\n`)

  const total = summary.failures.length + summary.successCount
  console.log(`${summary.successCount}/${total} scenarios succeeded.`)

  if (summary.failures.length > 0) {
    console.log(`\n------\n   Failed scenarios\n------\n`)

    summary.failures.sort().forEach(failure => {
      console.log(`  - ${failure}`)
    })
  }
}

parseScenarios()
  .then(runScenarios)
  .then(summary)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
