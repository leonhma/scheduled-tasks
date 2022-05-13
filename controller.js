import cron from 'node-cron';
const { schedule, validate } = cron;
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { spawn } from "child_process";

const jobs = parse(readFileSync('./jobs.yml', 'utf8')).jobs;

for (const [name, props] of Object.entries(jobs)) {
    console.log(`Scheduling job ${name}\n----------------------`);
    console.log(`props: ${JSON.stringify(props)}`);
    if ("daemon" in props) {
        console.log(`Starting daemon '${props.daemon}'`);
        const d = spawn(props.daemon);
        d.stdout.on('data', (data) => {
            console.log(`${name}: ${data}`);
        });
        d.stdout.on('error', (data) => {
            console.log(`${name}: ${data}`);
        });
        d.on('close', (code) => { console.log(`${name} exited with code ${code}`); });
    }
    console.log('jhbsgjbdsk')
    if ("cron" in props) { 
        console.log(`Scheduling '${props.command}' to run every ${props.cron}`);
        if (!validate(props.cron)) { console.log(`invalid cron expression ${props.cron}`); continue }
        if (!"command" in props) { console.log(`no command specified`); continue }
        schedule(props.cron, () => {
            const c = spawn(props.command);
            c.stdout.on('data', (data) => {
                console.log(`${name}: ${data}`);
            });
            c.stdout.on('error', (data) => {
                console.log(`${name}: ${data}`);
            });
            c.on('close', (code) => { console.log(`${name} exited with code ${code}`); });
        });
    }
    console.log('');
}
