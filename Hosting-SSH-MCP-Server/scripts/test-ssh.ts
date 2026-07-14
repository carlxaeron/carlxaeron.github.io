#!/usr/bin/env node
import * as ssh from '../src/ssh.ts'

const info = ssh.info()
console.log(JSON.stringify(info, null, 2))
const r = await ssh.execRemote('echo ok; pwd; ls public_html | head')
console.log(r)
