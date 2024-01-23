import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GetNamaPegawaiBidangdanBidangSub, GetReportOS } from 'src/store/module-reportos'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'
import { DataMdReportos } from 'src/models/dataa-md-offreportos'
import usedecodetoken from 'src/utils/decodecookies'
import { GetDataKegByIdLaporan } from 'src/store/module-rutinitas'
import { DataMdRutinitas } from 'src/models/data-md-rutinitas'
import { GetTaskByIdPegawai3Laporan } from 'src/store/module-penugasan'
import { DataMdPegawai, ResponseDataMdPegawai } from 'src/models/data-md-pegawai'
import jwt_decode from 'jwt-decode'
import api from 'src/utils/api'

let decodedToken: any
let id_offPegawai: string

const tglstart = '2024-01-01 08:00:00'
const tglend = '2024-01-31 08:00:00'
const monthreport = '2024-01 08:00:00'
const yearreport = '2024 08:00:00'

const LaporanKinerja = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(new AdapterDayjs().date())
  const [dataLaporan, setDataLaporan] = useState<DataMdReportos[]>([])
  const [dataRutinitas, setDataRutinitas] = useState<DataMdRutinitas[]>([])
  const [data4, setData4] = useState<any[]>([])
  const [tglStart, setTglStart] = useState('')
  const [tglEnd, setTglEnd] = useState('')
  const [monthReport, setMonthReport] = useState('')
  const [yearReport, setYearReport] = useState('')
  const [nameOffreportos, setNameOffreportos] = useState('')
  const [dataOptionById, setdataOptionById] = useState<DataMdPegawai[]>()
  const [dataPegawai, setDataPegawai] = useState<any[]>([])
  const [namaAtasan, setNamaAtasan] = useState<string>()
  const [nipAtasan, setNIPAtasan] = useState<string>()
  const [dataToken, setDataToken] = useState<string>('')
  const [nameOffPegawai, setNameOffPegawai] = useState('')
  const [nipOffPegawai, setNipOffPegawai] = useState('')

  console.log(dataLaporan)
  console.log(dataPegawai)
  const [dataById, setdataById] = useState<ResponseDataMdPegawai>({
    data: [],
    error: false,
    pesan: ''
  })

  function formatTanggal(tanggalStr: any) {
    const bulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ]

    const tanggal = new Date(tanggalStr)
    const hari = tanggal.getDate()
    const bulanIndex = tanggal.getMonth()
    const tahun = tanggal.getFullYear()

    return `${hari} ${bulan[bulanIndex]} ${tahun}`
  }
  function formatBulan(tanggalStr: any) {
    const bulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ]

    const tanggal = new Date(tanggalStr)
    const bulanIndex = tanggal.getMonth()

    return `${bulan[bulanIndex]}`
  }
  function formatTahun(tanggalStr: any) {
    const tanggal = new Date(tanggalStr)
    const tahun = tanggal.getFullYear()

    return `${tahun}`
  }

  useEffect(() => {
    const tokenData = localStorage.getItem('token')

    if (tokenData) {
      decodedToken = jwt_decode(tokenData)
      id_offPegawai = decodedToken.id_offpegawai.toString()
      setDataToken(id_offPegawai)
    } else {
    }
  }, [dataById])

  const fetchData = async () => {
    console.log(dataToken)
    if (dataToken !== '') {
      try {
        const idpegawai = '/get-datamdpegawai/' + dataToken.toString()

        const response = await api.get<ResponseDataMdPegawai>(idpegawai)
        setdataById(response.data)
        const tmpdata = response.data.data.filter(data => {
          return data.name_offpegawai
        })
        setdataOptionById(tmpdata)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  useEffect(() => {
    fetchData(), setSelectedDate(new AdapterDayjs().date())
  }, [dataToken])

  const getDataLaporan = async () => {
    try {
      const responseData = await GetReportOS(selectedDate ? selectedDate.format('YYYY-MM') : '')

      const tmpData = responseData.data.map(val => ({ ...val, id: val.id_offreportos }))
      if (responseData.data[0]?.name_offreportos) {
        setNameOffreportos(responseData.data[0]?.name_offreportos)
      }
      setTglStart(formatTanggal(tglstart))
      setTglEnd(formatTanggal(tglend))
      setMonthReport(formatBulan(monthreport))
      setYearReport(formatTahun(yearreport))
      setDataLaporan(tmpData)
      if (selectedDate) {
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getDataRutinitas = async () => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetDataKegByIdLaporan(
        decodedtoken?.id_offpegawai,
        selectedDate ? selectedDate.format('YYYY-MM') : ''
      )
      const tmpData = responseData.data.map(val => ({ ...val, id: val.id_offkeg }))
      setDataRutinitas(tmpData)
    } catch (error) {
      console.error(error)
    }
  }

  const getDaftarTugas3 = async () => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetTaskByIdPegawai3Laporan(
        decodedtoken?.id_offpegawai,
        '2',
        selectedDate ? selectedDate.format('YYYY-MM') : ''
      )
      const tmpData = responseData.data.map(val => ({
        ...val,
        id: val.id_userassign,
        id_offpegawai: val.id_offpegawai,
        code_assign: val.code_assign
      }))
      setData4(tmpData)
    } catch (error) {
      console.error(error)
    }
  }

  const getDataPegawai = async () => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetNamaPegawaiBidangdanBidangSub(decodedtoken?.id_bidang, decodedtoken?.id_bidangsub)
      const tmpData = responseData.data.map(val => ({
        ...val,
        id: val.id_offpegawai,
        id_bidang: val.id_bidang,
        id_bidangsub: val.id_bidangsub
      }))
      setDataPegawai(tmpData)
      if (tmpData.length > 0) {
        setNamaAtasan(tmpData[0].name_offpegawai)
        setNIPAtasan(tmpData[0].nip_offpegawai)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getDataPegawai2 = async () => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetNamaPegawaiBidangdanBidangSub(decodedtoken?.id_bidang, '1')
      const tmpData = responseData.data.map(val => ({
        ...val,
        id: val.id_offpegawai,
        id_bidang: val.id_bidang,
        id_bidangsub: val.id_bidangsub
      }))
      const filteredData = tmpData.filter(val => val.id_bidangsub === 1)
      setDataPegawai(tmpData)
      if (filteredData.length > 0) {
        setNameOffPegawai(filteredData[0].name_offpegawai)
        setNipOffPegawai(filteredData[0].nip_offpegawai)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getDataLaporan(), getDataRutinitas(), getDaftarTugas3(), getDataPegawai(), getDataPegawai2()
  }, [])

  return (
    <>
      <style>
        {`
          @media print {
            .pagebreak { page-break-before: always; }
            body {
              visibility: hidden;
            }
            #section-to-print {
              visibility: visible;
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `}
      </style>
      <div id='section-to-print'>
        <div
          style={{
            borderBottom: '1px',
            textAlign: 'center',
            justifyContent: 'center',
            marginTop: '20px',
            marginLeft: '40px',
            marginRight: '40px'
          }}
        >
          <Typography variant='h5'>LAPORAN KINERJA PEGAWAI</Typography>
        </div>
        <div
          style={{
            float: 'left',
            textAlign: 'left',
            justifyContent: 'center',
            marginTop: '20px',
            marginLeft: '40px',
            marginRight: '40px'
          }}
        >
          <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>
            <span style={{ display: 'inline-block', width: '5cm' }}>Kepada</span> : Yth. Sekretaris Dinas Komunikasi Dan
            Informatika
          </Typography>
          <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>
            <span style={{ display: 'inline-block', width: '5cm' }}>Dari</span> :{' '}
            {dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_offpegawai : '-'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>
            <span style={{ display: 'inline-block', width: '5cm' }}>Tanggal</span> : {tglStart} s.d {tglEnd}
          </Typography>
          <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>
            <span style={{ display: 'inline-block', width: '5cm' }}>Perihal</span> : {nameOffreportos}
          </Typography>
        </div>
        <div
          style={{
            float: 'left',
            textAlign: 'left',
            justifyContent: 'center',
            marginTop: '80px',
            marginLeft: '40px',
            marginRight: '40px'
          }}
        >
          <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>
            Dengan ini disampaikan laporan kinerja pegawai selama bulan {monthReport} {yearReport}, pada{' '}
            {dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_bidangsub : '-'},{' '}
            {dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_bidang : '-'} dan Dinas Komunikasi dan
            Informatika, sebagai berikut:
          </Typography>
        </div>
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}></table>
        <div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid', padding: '8px', minWidth: '30px', width: '30px' }}>Nomor</th>
                  <th style={{ border: '1px solid', padding: '8px', minWidth: '200px', width: '100px' }}>
                    Hari/Tanggal
                  </th>
                  <th style={{ border: '1px solid', padding: '8px' }}>Uraian Kegiatan</th>
                </tr>
              </thead>
              <tbody>
                {[...dataRutinitas, ...data4]
                  .filter(item => item.code_assign === 1 || item.code_assign === 2)
                  .map((item, index) => (
                    <tr key={item.id_offkeg || item.id_userassign}>
                      <td style={{ border: '1px solid', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid', padding: '8px', textAlign: 'center' }}>
                        {item.tgl_offkeg || item.tgl_offtask}{' '}
                      </td>
                      <td style={{ border: '1px solid', padding: '8px' }}>
                        {item.code_assign === 1
                          ? `[${item.jam_offkeg}] - [${item.jam_offkeg2}] ${item.cap_offkeg}`
                          : `[${item.jam_offtask}] ${item.cap_offtask}`}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className='pagebreak'
          style={{
            textAlign: 'center',
            justifyContent: 'center',
            marginTop: '20px',
            marginLeft: '40px',
            marginRight: '40px'
          }}
        >
          <div
            style={{
              float: 'left',
              textAlign: 'center',
              justifyContent: 'center',
              marginTop: '20px',
              marginLeft: '20px'
            }}
          >
            <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>Mengetahui,</Typography>
            <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>Sub Koordinator / PPTK / PLT</Typography>
            <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>
              Kepala {dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_bidangsub : '-'}
            </Typography>
            <Typography
              sx={{ color: 'text.secondary', marginBottom: '10px', marginTop: '100px', textDecoration: 'underline' }}
            >
              {namaAtasan}
            </Typography>
            <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>NIP. {nipAtasan}</Typography>
          </div>
          <div
            style={{
              float: 'right',
              textAlign: 'center',
              justifyContent: 'center',
              marginTop: '20px',
              marginRight: '20px'
            }}
          >
            <Typography sx={{ color: 'text.secondary', marginBottom: '10px', marginTop: '25px' }}>
              Yang Melaporkan,
            </Typography>
            <Typography sx={{ color: 'text.secondary', marginBottom: '10px', marginTop: '140px' }}>
              {dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_offpegawai : '-'}
            </Typography>
          </div>
        </div>
        <div
          style={{
            borderBottom: '1px',
            textAlign: 'center',
            justifyContent: 'center',
            marginTop: '320px',
            marginLeft: '40px',
            marginRight: '40px'
          }}
        >
          <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>Menyetujui,</Typography>
          <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>
            Kepala {dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_bidang : '-'}
          </Typography>

          <Typography
            sx={{ color: 'text.secondary', marginBottom: '10px', marginTop: '100px', textDecoration: 'underline' }}
          >
            {nameOffPegawai}
          </Typography>
          <Typography sx={{ color: 'text.secondary', marginBottom: '10px' }}>NIP. {nipOffPegawai}</Typography>
          <Button
            variant='contained'
            color='primary'
            sx={{
              '@media print': {
                display: 'none'
              }
            }}
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.print()
              }
            }}
          >
            Cetak
          </Button>
        </div>
      </div>
    </>
  )
}

export default LaporanKinerja
