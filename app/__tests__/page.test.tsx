import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Home />)
    
    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the welcome text', () => {
    render(<Home />)
    
    const welcomeText = screen.getByText(/Get started by editing/i)
    expect(welcomeText).toBeInTheDocument()
  })

  it('renders the deploy button', () => {
    render(<Home />)
    
    const deployButton = screen.getByRole('link', { name: /deploy now/i })
    expect(deployButton).toBeInTheDocument()
    expect(deployButton).toHaveAttribute('href', expect.stringContaining('vercel.com'))
  })

  it('renders the docs link', () => {
    render(<Home />)
    
    const docsLink = screen.getByRole('link', { name: /read our docs/i })
    expect(docsLink).toBeInTheDocument()
    expect(docsLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/docs'))
  })

  it('renders footer navigation links', () => {
    render(<Home />)
    
    const learnLink = screen.getByRole('link', { name: /learn/i })
    const examplesLink = screen.getByRole('link', { name: /examples/i })
    const nextjsLink = screen.getByRole('link', { name: /go to nextjs.org/i })
    
    expect(learnLink).toBeInTheDocument()
    expect(examplesLink).toBeInTheDocument()
    expect(nextjsLink).toBeInTheDocument()
  })
})