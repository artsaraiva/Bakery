<template lang="html">
  <v-text-field v-bind:label="this.$props.label"
                :value="formattedValue"
                @input="change"
                v-money="{precision, decimal, thousands, prefix, suffix}"
                :readonly="readonly" />
</template>

<script>
import { Money } from 'v-money'

function format (input, opt) {
  if (typeof input === 'number') {
    input = input.toFixed(fixed(opt.precision))
  }

  const numbers = onlyNumbers(input)
  const currency = numbersToCurrency(numbers, opt.precision)
  const parts = toStr(currency).split('.')
  let integer = parts[0]
  const decimal = parts[1]
  integer = addThousandSeparator(integer, opt.thousands)
  return opt.prefix + joinIntegerAndDecimal(integer, decimal, opt.decimal) + opt.suffix
}

function unformat (input, precision) {
  const numbers = onlyNumbers(input)
  const currency = numbersToCurrency(numbers, precision)
  return parseFloat(currency)
}

function onlyNumbers (input) {
  return toStr(input).replace(/\D+/g, '') || '0'
}

function fixed (precision) {
  return between(0, precision, 20)
}

function between (min, n, max) {
  return Math.max(min, Math.min(n, max))
}

function numbersToCurrency (numbers, precision) {
  const exp = Math.pow(10, precision)
  const float = parseFloat(numbers) / exp
  return float.toFixed(fixed(precision))
}

function addThousandSeparator (integer, separator) {
  return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`)
}

function joinIntegerAndDecimal (integer, decimal, separator) {
  return decimal ? integer + separator + decimal : integer
}

function toStr (value) {
  return value ? value.toString() : ''
}

export default {
  props: {
    value: {
      required: true,
      type: [Number, String],
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    masked: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number,
      default: 2
    },
    decimal: {
      type: String,
      default: ','
    },
    thousands: {
      type: String,
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  directives: { money: Money },
  data () {
    return {
      formattedValue: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newValue, oldValue) {
        const formatted = format(newValue, this.$props)
        this.formattedValue = formatted
      }
    }
  },
  methods: {
    change (value) {
      this.$emit('input', this.masked ? value : unformat(value, this.precision))
    }
  }
}
</script>
