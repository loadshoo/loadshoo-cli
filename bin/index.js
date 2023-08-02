#!/usr/bin/env node
import inquirer from 'inquirer';
import figlet from "figlet";
import Printer from "@darkobits/lolcatjs";
import { program } from "commander";
import ora from "ora";
import shell from "shelljs";

const text = figlet.textSync("my-cli");
const textColor = Printer.fromString(text);

const gitLibSrcList = {
  "react": "https://github.com/loadshoo/koa-nuxt-template",
  "vue2": "https://github.com/loadshoo/koa-nuxt-template",
  "vue3": "https://github.com/loadshoo/koa-nuxt-template",
}

program.version(textColor);

const hander = {
  create: env => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "type",
          message: "请选择框架类型",
          choices: ["react", "vue2", "vue3"]
        }, {
          type: "list",
          name: "typeScript",
          message: "是否使用TypeScript",
          choices: ["yes", "no"]
        }, {
          type: "checkbox",
          name: "packages",
          message: "选择你需要默认安装的库",
          choices: ["antd", "view", "MUI", "UMI"]
        }
      ])
      .then(answers => {
        // console.log(answers);
        if (!shell.which("git")) {
          shell.echo("Sorry, this script requires git");
          shell.exit(1);
        } else {
          const clone = ora(`正下载模版到 '${env}'...\n`).start();
          shell.exec(`git clone ${gitLibSrcList[answers.type]} ${env}`,{silent: true} ,(code, stdout, stderr) => {  
            if(code != 0) {
              ora(stderr).fail();
            } else {
              clone.succeed();
            }
            clone.stop();
          });
          gitInit(env);
        }
      });
  }
};

const gitInit = (env) => {
  const os = process.platform;
  if (os === 'darwin') {
    shell.exec(`rm -rf ./${env}/.git`)
  } else {
    shell.exec(`rd /q/s ./${env}/.git`)
  }
  shell.exec(`cd ./${env} && git init -q && cd ..`)
}

program.arguments("<cmd> [env]").action(function(cmd, env) {
  if (hander[cmd]) {
    hander[cmd](env);
  } else {
    console.log(`很抱歉，暂未实现该${cmd}命令`);
  }
});

// 处理参数入口
program.parse(process.argv);