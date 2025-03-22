import { Title } from '@/app/(protected)/_components/title'
import { WrapperVariant } from '../../_components/wrapper-variant'
import { AreaVariant } from '@/components/area-variant'
import { PieVariant } from '@/components/pie-variant'
import { BarVariant } from '@/components/bar-variant'
import { LineVariant } from '@/components/line-variant'
import { RadarVariant } from '@/components/radar-variant'
import { Analytics } from '../_components/analytics'

const Options = () => (
  <div className="flex flex-col items-end">
    <div className="text-xs text-emerald-400">+47,93%*</div>
    <div className="text-2xl font-bold">R$ 145.231,89</div>
  </div>
)

export default function AnalyticsPage() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Title>Desempenho</Title>
        {/* Actions */}
      </div>
      <Analytics />
      <div className="grid grid-cols-4 gap-4">
        <WrapperVariant title="Vendas" options={<Options />}>
          <AreaVariant />
        </WrapperVariant>
        <WrapperVariant title="Faturamento" options={<Options />}>
          <AreaVariant />
        </WrapperVariant>
        <WrapperVariant title="Ticket médio" options={<Options />}>
          <AreaVariant />
        </WrapperVariant>
        <WrapperVariant title="Carrinos abandonados" options={<Options />}>
          <LineVariant />
        </WrapperVariant>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <WrapperVariant title="Mais vendidos">
          <PieVariant />
        </WrapperVariant>
        <WrapperVariant title="Métodos de pagamento">
          <PieVariant />
        </WrapperVariant>
        <WrapperVariant title="Cancelamentos">
          <BarVariant />
        </WrapperVariant>
        <WrapperVariant title="Horários">
          <RadarVariant />
        </WrapperVariant>
      </div>
    </div>
  )
}
