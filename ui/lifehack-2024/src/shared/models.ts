import { Entity, Fields } from 'remult'

@Entity('historicalData', {
    allowApiCrud: true,
})

export class HistoricalData {
    @Fields.autoIncrement()
    id = ''

    @Fields.object()
    data!: { month: string[], demand: number[] };

    @Fields.createdAt()
    createdAt?: Date
}

@Entity('projectedData', {
    allowApiCrud: true,
})

export class ProjectedData {
    @Fields.cuid()
    id = ''

    @Fields.object()
    data!: { month: string[], demand: number[] };

    @Fields.createdAt()
    createdAt?: Date
}

@Entity('projectedDemand', {
    allowApiCrud: true,
})

export class ProjectedDemand {
    @Fields.cuid()
    id = ''

    @Fields.number()
    projection!: number;

    @Fields.createdAt()
    createdAt?: Date
}
