import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await userService.getAllMembers(req.query.search as string);
    res.status(200).json({ status: 'success', data: members });
  } catch (err) { next(err); }
};

export const getMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await userService.getMemberById(req.params.id);
    res.status(200).json({ status: 'success', data: member });
  } catch (err) { next(err); }
};

export const createMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await userService.createMember(req.body);
    res.status(201).json({ status: 'success', data: member });
  } catch (err) { next(err); }
};

export const updateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await userService.updateMember(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: member });
  } catch (err) { next(err); }
};

export const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteMember(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};
