# yats-typewriter

Yet Another TypeScript typewriter package. No dependencies required.

```sh
npm i yats-typewriter
```

## Features
- **Type** any text, one character at a time
- **Delete** a set number of characters
- **Loop** forever, starting from any rule you choose
- **Control the speed** with your own typing delay and pause times

## Usage

```ts
import { typewriter } from 'yats-typewriter'

const title = document.querySelector('h1')!

const stop = typewriter(
    {
        rules: [{ write: 'hi' }, { delete: 2 }, { write: 'bye' }, { delete: 3 }],
        loopFrom: 0
    },
    (text) => (title.textContent = text)
)
```

Call `stop()` to end it.

## Options

| Option     | Default  | Description                                           |
| ---------- | -------- | ----------------------------------------------------- |
| `rules`    | required | `{ write: 'text' }` or `{ delete: 3 }`                |
| `delay`    | `100`    | ms between keystrokes                                 |
| `cooldown` | `1000`   | ms pause after a `write` rule                         |
| `loopFrom` | none     | Rule index to loop back to. Leave it out to play once |

## React

```tsx
import { useEffect, useState } from 'react'
import { typewriter } from 'yats-typewriter'

// keep outside the component
const options = {
    rules: [{ write: 'hi' }, { delete: 2 }, { write: 'bye' }, { delete: 3 }],
    loopFrom: 0
}

export function Title() {
    const [text, setText] = useState('')
    useEffect(() => typewriter(options, setText), [])
    return <h1>{text}</h1>
}
```

## Vue

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { typewriter } from 'yats-typewriter'

const options = {
    rules: [{ write: 'hi' }, { delete: 2 }, { write: 'bye' }, { delete: 3 }],
    loopFrom: 0
}

const text = ref('')
let stop = () => {}

onMounted(() => {
    stop = typewriter(options, (t) => (text.value = t))
})
onUnmounted(() => stop())
</script>

<template>
    <h1>{{ text }}</h1>
</template>
```

## License

MIT
