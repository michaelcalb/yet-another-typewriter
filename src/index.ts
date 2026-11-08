export type TypewriterRule = { write: string } | { delete: number }

export interface TypewriterOptions {
    rules: TypewriterRule[]
    /** ms between characters. Default 100 */
    delay?: number
    /** ms to wait after a `write` rule finishes. Default 1000 */
    cooldown?: number
    /** Rule index to jump back to after the last rule. Omit to stop at the end. */
    loopFrom?: number
}

/**
 * Runs the typewriter and calls `onChange` with the current text on every keystroke.
 * Returns a function that stops it.
 */
export function typewriter(
    { rules, delay = 100, cooldown = 1000, loopFrom }: TypewriterOptions,
    onChange: (text: string) => void
): () => void {
    if (loopFrom !== undefined && !(loopFrom >= 0 && loopFrom < rules.length)) {
        throw new RangeError(`loopFrom ${loopFrom} is out of range`)
    }

    let text = ''
    let ruleIndex = 0
    let charIndex = 0
    let timerId: ReturnType<typeof setTimeout> | undefined

    const next = (ms: number) => {
        timerId = setTimeout(tick, ms)
    }

    const finishRule = (ms: number) => {
        charIndex = 0
        if (ruleIndex + 1 < rules.length) ruleIndex++
        else if (loopFrom !== undefined) ruleIndex = loopFrom
        else return
        next(ms)
    }

    const tick = () => {
        const rule = rules[ruleIndex]
        if ('write' in rule) {
            if (charIndex < rule.write.length) {
                text += rule.write[charIndex++]
                onChange(text)
                next(delay)
            } else {
                finishRule(cooldown)
            }
        } else if (charIndex < rule.delete && text.length > 0) {
            text = text.slice(0, -1)
            charIndex++
            onChange(text)
            next(delay)
        } else {
            finishRule(delay)
        }
    }

    if (rules.length) next(delay)

    return () => clearTimeout(timerId)
}
