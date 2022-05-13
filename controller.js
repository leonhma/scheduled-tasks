const { schedule, validate } = require("node-cron");
const { parse } = require('yaml');
const { readFileSync } = require('fs');
const { spawn } = require("child_process");

const jobs = parse(readFileSync('./jobs.yml', 'utf8')).jobs;

for (const [name, props] of Object.entries(jobs)) {
    console.log(`Scheduling job ${name}\n----------------------`);
    if (props.daemon) { 
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
    if (props.cron) { 
        console.log(`Scheduling '${props.command}' to run every ${props.cron}`);
        if (!validate(props.cron)) { console.log(`invalid cron expression ${props.cron}`); continue }
        if (!props.command) { console.log(`no command specified`); continue }
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
