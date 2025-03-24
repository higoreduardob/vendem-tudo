'use client'

import { useMemo } from 'react'
import { Label, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { numericFieldsFilter } from '@/constants'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const PieVariant = ({ data, fields }: VariantProps) => {
  const dataKey = useMemo(() => {
    const numericField = fields.find((field) =>
      numericFieldsFilter.some((term) => field.key.toLowerCase().includes(term))
    )
    return numericField?.key || fields[1]?.key || 'quantity'
  }, [fields])

  const nameKey = useMemo(() => {
    const labelField = fields.find((field) =>
      ['name', 'label', 'browser', 'id', 'title'].some((term) =>
        field.key.toLowerCase().includes(term)
      )
    )
    return labelField?.key || fields[0]?.key || 'name'
  }, [fields])

  const total = useMemo(() => {
    if (!data || data.length === 0) return 0

    return data.reduce((acc, curr) => {
      const value = curr[dataKey]
      return acc + (typeof value === 'number' ? value : 0)
    }, 0)
  }, [data, dataKey])

  const customConfig = useMemo(() => {
    const config: ChartConfig = {}

    config[dataKey] = {
      label: fields.find((f) => f.key === dataKey)?.label || 'Quantidade',
    }

    data.forEach((item, index) => {
      const itemKey = typeof item.id === 'string' ? item.id : `item-${index}`
      config[itemKey] = {
        label: typeof item.name === 'string' ? item.name : `Item ${index + 1}`,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })

    return config
  }, [data, dataKey, fields])

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data.map((item, index) => {
      const colorIndex = (index % 5) + 1

      return {
        ...item,
        fill: `hsl(var(--chart-${colorIndex}))`,
        itemId: typeof item.id === 'string' ? item.id : `item-${index}`,
      }
    })
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ChartContainer
        config={customConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {fields[0]?.label ||
                          dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  )
}
