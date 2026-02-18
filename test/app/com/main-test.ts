import { createApp } from 'vue'
import App from './App.vue'
import TestFela from './test-fela.vue'
import TestRegular from './test-regular.vue'
import TestMixed from './test-mixed.vue'
import TestNested from './test-nested.vue'
import TestPreserve from './test-preserve.vue'
import TestDynamic from './test-dynamic.vue'
import TestNoFela from './test-no-fela.vue'

const app = createApp(App)

// Register all test components
app.component('test-fela-component', TestFela)
app.component('test-regular-component', TestRegular)
app.component('test-mixed-component', TestMixed)
app.component('test-nested-component', TestNested)
app.component('test-preserve-component', TestPreserve)
app.component('test-dynamic-component', TestDynamic)
app.component('test-no-fela-component', TestNoFela)

app.mount('#app')
