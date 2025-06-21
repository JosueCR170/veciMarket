import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import VerProductos from '../components/verProductos/verProductos'
import { UserProvider } from '../context/contextUsuario'
import { vi } from 'vitest'

vi.mock('../services/firebase/productService', () => {
  const mockProductos = [
    {
      id: '1',
      nombre: 'Cámara',
      descripcion: 'Cámara digital',
      precio: 100,
      categoria: 'electrónica',
      img: 'camara.jpg',
      contacto: null,
    },
    {
      id: '2',
      nombre: 'Camiseta',
      descripcion: 'Camiseta de algodón',
      precio: 20,
      categoria: 'ropa',
      img: 'camiseta.jpg',
      contacto: null,
    },
  ]

  return {
    getProductosByVendedorId: () =>
      Promise.resolve({
        success: true,
        productos: mockProductos,
      }),
  }
})

describe('VerProductos', () => {
  it('Renderiza productos después de cargar', async () => {
    render(
      <UserProvider>
        <VerProductos idVendedor="vendedor1" />
      </UserProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('Cámara')).toBeInTheDocument()
      expect(screen.getByText('Camiseta')).toBeInTheDocument()
    })
  })


  it('Abre modal al hacer click en producto', async () => {
    render(
      <UserProvider>
        <VerProductos idVendedor="vendedor1" />
      </UserProvider>
    )

    await waitFor(() => screen.getByText('Cámara'))

    const producto = screen.getByText('Cámara')
    fireEvent.click(producto)
    await waitFor(() => {
      expect(screen.getByText(/Cámara/i)).toBeInTheDocument()
    })
  })
})
