#! /usr/bin/env node

// 程序进程
const program = require('commander')
// 程序子进程
const cp = require('child_process')
// 下载github仓库
const download = require('download-git-repo')
// 命令行交互
const inquirer = require('inquirer')
// 处理模板
const handlebars = require('handlebars')
// loading效果
const ora = require('ora')
// 给字体增加颜色
const chalk = require('chalk')
// 处理文件
const fs = require('fs')
// 处理路径
const path = require('path')

const downloadUrl = 'direct:https://github.com/zhuyuanmin/my-typescript-react-demo.git'

program
    .version('0.1.1', '-v, --version')
    .command('create <project>')
    .description('初始化模板')
    .action(function (projectName) {
        const result = fs.existsSync(path.join(process.cwd(), projectName))
        if (result) {
            console.log(chalk.red('error: 存在同名文件夹，无法继续创建项目！'))
            return
        }
        
        inquirer
            .prompt([
				{
                    type: 'input',
                    name: 'name',
                    message: '请输入项目名称：',
                },
                {
                    type: 'input',
                    name: 'description',
                    message: '请输入项目描述：',
                },
                {
                    type: 'input',
                    name: 'author',
                    message: '请输入项目作者',
                },
                {
                    type: 'confirm',
                    name: 'cssStyle',
                    message: '是否使用less/node-sass：',
                },
                {
                    type: 'list',
                    message: '请选择以下css预处理器:',
                    name: 'preprocessor',
                    choices: ['less', 'sass'],
                    when: function (answers) {
                        return answers.cssStyle
                    },
                },
                {
                    type: 'confirm',
                    name: 'installMode',
                    message: '使用npm还是yarn安装：',
                },
                {
                    type: 'list',
                    message: '请选择以下依赖安装方式:',
                    name: 'installList',
                    choices: ['npm', 'yarn'],
                    when: function (answers) {
                        return answers.installMode
                    },
                },
            ])
            .then(function (answers) {
                const params = {
                    name: answers.name,
                    description: answers.description,
                    author: answers.author,
                }
                // 为了配合antd修改，less 默认会安装
                if (answers.cssStyle) {
                    //用户选择使用css预处理器
                    if (answers.preprocessor === 'sass') {
                        // 用户选择使用sass
                        params.sass = true
                    }
                }

                if (answers.installMode) {
                    if (answers.installList === 'npm') {
                        params.mode = 'npm'
                    } else {
                        params.mode = 'yarn'
                    }
                } else {
                    params.mode = 'npm'
                }

                console.log('')
                const spinner = ora('正在下载中...').start()
                download(downloadUrl, projectName, { clone: true }, err => {
                    if (err) {
                        console.log(err)
                        spinner.text = '下载失败'
                        spinner.fail()
                    } else {
                        const packagePath = `${projectName}/package.json`
                        const packageStr = fs.readFileSync(packagePath, 'utf-8')
                        const package = handlebars.compile(packageStr)(params)
                        fs.writeFileSync(packagePath, package)

                        if (params.sass) {
                            // 由于国内网络原因，node-sass可能需要翻墙才能下载
                            // 所以如果用户选择了sass预处理器则需要创建.npmrc文件
                            // 并写入node-sass的代理下载地址
                            const npmrcPath = `${projectName}/.npmrc`
                            const appendContent =
                                '\r\nsass_binary_site=https://npm.taobao.org/mirrors/node-sass/'
                            if (!fs.existsSync(npmrcPath)) {
                                fs.writeFileSync(npmrcPath, appendContent)
                            } else {
                                fs.appendFileSync(npmrcPath, appendContent)
                            }
                        }
                        spinner.text = '下载成功'
                        spinner.color = '#13A10E'
                        spinner.succeed()

                        console.log('正在安装依赖...')
                        cp.exec(`cd ${projectName} && ${params.mode} install`, function (error) {
                            if (error) {
                                console.error(`执行的错误: ${error}`)
                                return
                            }

                            console.log('')
                            // 提示进入下载的目录
                            console.log(' # cd into Project')
                            console.log(chalk.gray('   $ ') + chalk.blue(`cd ${projectName}`))
                            console.log('')
                            // 提示运行开发环境
                            console.log(' # Compiles and hot-reloads for development')
                            console.log(chalk.gray('   $ ') + chalk.blue(`${params.mode} start`))
                            console.log('')
                            // 提示打包生产环境代码
                            console.log(' # Compiles and minifies for production')
                            console.log(chalk.gray('   $ ') + chalk.blue(params.mode === 'npm' ? 'npm run build' : 'yarn build'))
                        })
                    }
                })
            })
    })

// 解析命令行参数
program.parse(process.argv)
