import React from 'react'
export const CampfireBubble = ({ children, role }: { children: React.ReactNode; role: string }) => <div data-role={role}>{children}</div>
