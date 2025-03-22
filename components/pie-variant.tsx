'use client'

import { useMemo } from 'react'
import { Label, Pie, PieChart, ResponsiveContainer, LabelList } from 'recharts'

import { numericFieldsFilter } from '@/constants'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

declare type DataField = {
  key: string
  color: string
  label: string
}

declare type VariantProps = {
  data: {
    date?: string
    [key: string]: number | string | undefined
  }[]
  fields: DataField[]
}

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

  const customConfig = fields.reduce((acc, field) => {
    acc[field.key] = {
      label: field.label,
      color: field.color,
    }
    return acc
  }, {} as ChartConfig)

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data.map((item, index) => {
      const fieldKey = fields[index % fields.length]?.key || fields[0]?.key
      const field = fields.find((f) => f.key === fieldKey) || fields[0]

      return {
        ...item,
        fill: field?.color || `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })
  }, [data, fields])

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
            label={(entry) => entry[nameKey] as string}
          >
            <LabelList
              dataKey={nameKey}
              position="outside"
              className="fill-foreground text-xs"
            />

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
