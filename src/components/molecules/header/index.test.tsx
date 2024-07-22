import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from './index'

describe('Header', () => {
  it('renders a heading', () => {
    render(<Header />)

    const heading = screen.getByRole('heading', {
      name: /Pokédex/i,
    })

    expect(heading).toBeInTheDocument()
  })
})