import cron from 'node-cron';
const { schedule, validate } = cron;
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { spawn } from "child_process";
import { stdout } from 'process';

const jobs = parse(readFileSync('./jobs.yml', 'utf8')).jobs;

const command = (cmd) => { 
    const res = cmd.split(' ')
    return [res[0], res.slice(1)]
}

for (const [name, props] of Object.entries(jobs)) {
    console.log(`Scheduling job ${name}\n----------------------------------------`);
    if ("daemon" in props) {
        console.log(`Starting daemon '${props.daemon}'`);
        const [cmd, args] = command(props.daemon)
        const d = spawn(cmd, args);
        d.stdout.on('data', (data) => {
            stdout.write(`${name}: ${data}`);
        });
        d.stdout.on('error', (data) => {
            stdout.write(`${name}: ${data}`);
        });
        d.on('close', (code) => { console.log(`${name} exited with code ${code}`); });
    }
    if ("cron" in props) { 
        console.log(`Scheduling '${props.command}' to run every ${props.cron}`);
        if (!validate(props.cron)) { console.log(`invalid cron expression ${props.cron}`); continue }
        if (!"command" in props) { console.log(`no command specified`); continue }
        schedule(props.cron, () => {
            const [cmd, args] = command(props.command)
            const d = spawn(cmd, args);
            c.stdout.on('data', (data) => {
                stdout.write(`${name}: ${data}`);
            });
            c.stdout.on('error', (data) => {
                stdout.write(`${name}: ${data}`);
            });
            c.on('close', (code) => { console.log(`${name} exited with code ${code}`); });
        });
    }
    console.log('');
}
