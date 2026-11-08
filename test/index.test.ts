import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { typewriter } from '../src/index.ts'

test('writes, deletes, loops, stops', () => {
    mock.timers.enable({ apis: ['setTimeout'] })
    const seen: string[] = []
    const stop = typewriter(
        {
            rules: [{ write: 'ab' }, { delete: 1 }, { write: 'c' }],
            delay: 10,
            cooldown: 50,
            loopFrom: 1
        },
        (t) => seen.push(t)
    )
    const advance = (ms: number) => {
        for (let i = 0; i < ms; i++) mock.timers.tick(1)
    }
    advance(1000)
    stop()
    const count = seen.length
    advance(1000)
    mock.timers.reset()

    assert.deepEqual(seen.slice(0, 5), ['a', 'ab', 'a', 'ac', 'a'])
    assert.equal(seen.length, count, 'stop() halts updates')
})

test('rejects out-of-range loopFrom', () => {
    assert.throws(
        () => typewriter({ rules: [{ write: 'a' }], loopFrom: 3 }, () => {}),
        RangeError
    )
})
