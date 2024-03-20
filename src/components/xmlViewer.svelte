<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, ListPlaceholder, Heading, Popover } from 'flowbite-svelte'
  import HelpButton from './HelpButton.svelte';

  export let file: File;

  const reader = new FileReader();
  let currency: string | null = 'MXN';
  let xmlDocument: XMLDocument;
  let comprobante: Element | null;
  let nomina: Element | null;
  let receptor: Element | null;
  let percepcionesNode: Element | null;
  let percepciones: NodeListOf<Element>;
  let deducciones: NodeListOf<Element>;
  let otrosPagos: NodeListOf<Element>;

  reader.onload = () => {
    if (null == reader.result) return;

    xmlDocument = new DOMParser().parseFromString(reader.result.toString().trim(), 'text/xml');

    comprobante = xmlDocument.querySelector('Comprobante')
    nomina = xmlDocument.querySelector('Nomina')
    receptor = xmlDocument.querySelector('Nomina Receptor')
    percepcionesNode = xmlDocument.querySelector('Percepciones')
    percepciones = xmlDocument.querySelectorAll('Percepcion')
    deducciones = xmlDocument.querySelectorAll('Deduccion')
    otrosPagos = xmlDocument.querySelectorAll('OtroPago')

    if (null != comprobante && null) {
      currency = comprobante.getAttribute('Moneda')
    }
  }
  reader.readAsText(file);
</script>

{#if xmlDocument}
  {#if null != nomina && null != receptor}
    <div class="flex flex-row">
      <Table divClass="w-full m-3">
        <TableBody>
          <TableBodyRow>
            <TableHeadCell>Puesto</TableHeadCell>
            <TableBodyCell tdClass="px-6 py-4 text-right">{receptor.getAttribute('Puesto')}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableHeadCell>
              Salario integrado
              <HelpButton title="Show information" text="El Salario Diario Integrado (SDI) es el salario diario que recibe un trabajador más todas las prestaciones de ley y superiores a la ley que se encuentren en el recibo de nómina. En términos simples, el SDI es el resultado de la suma de todas las percepciones un trabajador." />
            </TableHeadCell>
            <TableBodyCell tdClass="px-6 py-4 text-right">$ {receptor.getAttribute('SalarioDiarioIntegrado')} {currency}</TableBodyCell>
          </TableBodyRow>
        </TableBody>
      </Table>
      <Table divClass="w-full m-3">
        <TableBody>
          <TableBodyRow>
            <TableHeadCell>Fecha de pago</TableHeadCell>
            <TableBodyCell tdClass="px-6 py-4 text-right">{nomina.getAttribute('FechaPago')}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableHeadCell>Días Pagados</TableHeadCell>
            <TableBodyCell tdClass="px-6 py-4 text-right">{nomina.getAttribute('NumDiasPagados')}</TableBodyCell>
          </TableBodyRow>
        </TableBody>
      </Table>
    </div>
  {/if}
  <div class="flex flex-row">
    <div class="w-full m-3">
      <Heading tag="h2" class="mb-4" customSize="text-2xl font-extrabold  md:text-3xl lg:text-4xl">Percepciones</Heading>
      <Table hoverable={true}>
        <TableHead>
          <TableHeadCell>Concepto</TableHeadCell>
          <TableHeadCell>
            Importe Gravado
            <HelpButton title="Show information" text="Los ingresos gravados son aquellos determinados por la Ley del Impuesto Sobre la Renta (LISR) y que están sometidos al pago del impuesto, luego de haber aplicado las deducciones legalmente establecidas, en el caso de haberlas." />
          </TableHeadCell>
          <TableHeadCell>
            Importe Excento
            <HelpButton title="Show information" text="Los ingresos exentos son aquellos que recibe el trabajador, y que, de acuerdo a su tratamiento fiscal, se tiene el derecho de no gravar impuesto por ellos. De manera que estos ingresos no se consideran aplicables para la base gravable en la determinación del impuesto sobre la renta." />
          </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each percepciones as percepcion}
          <TableBodyRow>
            <TableBodyCell>{percepcion.getAttribute('Concepto')}</TableBodyCell>
            <TableBodyCell tdClass="text-right">$ {percepcion.getAttribute('ImporteGravado')} {currency}</TableBodyCell>
            <TableBodyCell tdClass="text-right">$ {percepcion.getAttribute('ImporteExento')} {currency}</TableBodyCell>
          </TableBodyRow>
          {/each}
        </TableBody>
        {#if null != percepcionesNode}
          <tfoot>
            <tr class="font-semibold text-gray-900 dark:text-white">
              <th scope="row" class="py-3 px-6 text-base">Total</th>
              <td class="text-right">$ {percepcionesNode.getAttribute('TotalGravado')} {currency}</td>
              <td class="text-right">$ {percepcionesNode.getAttribute('TotalExento')} {currency}</td>
            </tr>
          </tfoot>
        {/if}
      </Table>
      <Heading tag="h2" class="mb-4 mt-4" customSize="text-2xl font-extrabold  md:text-3xl lg:text-4xl">Otros Pagos</Heading>
      <Table hoverable={true}>
        <TableHead>
          <TableHeadCell>Concepto</TableHeadCell>
          <TableHeadCell>Importe</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each otrosPagos as otroPago}
            <TableBodyRow>
              <TableBodyCell>{otroPago.getAttribute('Concepto')}</TableBodyCell>
              <TableBodyCell tdClass="text-right">$ {otroPago.getAttribute('Importe')} {currency}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
    <div class="w-full m-3">
      <Heading tag="h2" class="mb-4" customSize="text-2xl font-extrabold  md:text-3xl lg:text-4xl">Deducciones</Heading>
      <Table hoverable={true}>
        <TableHead>
          <TableHeadCell>Concepto</TableHeadCell>
          <TableHeadCell>Importe</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each deducciones as deduccion}
          <TableBodyRow>
            <TableBodyCell>
              {deduccion.getAttribute('Concepto')}
              {#if "FAHORRO EMPRESA" == deduccion.getAttribute('Concepto')}
              <HelpButton title="Show information" text="Percepción FONDO DE AHORRO EMPRESA" />
              {/if}
            </TableBodyCell>
            <TableBodyCell tdClass="text-right">$ {deduccion.getAttribute('Importe')} {currency}</TableBodyCell>
          </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </div>
{:else}
  <ListPlaceholder />
{/if}
